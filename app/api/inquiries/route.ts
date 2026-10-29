import { deliverInquiry, inquiryFingerprint } from '@/lib/formspree';
import { env } from 'cloudflare:workers';
import { leadSchema } from '@/lib/inquiry';
import { filterProviders } from '@/content/providers';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return json({code:'origin'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({code:'format'},415);
 if(Number(request.headers.get('content-length')||0)>12000)return json({code:'too_large'},413);
 let raw:string;try{const reader=request.body?.getReader();if(!reader)return json({code:'invalid'},400);let length=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>12000){await reader.cancel();return json({code:'too_large'},413)}chunks.push(value)}const all=new Uint8Array(length);let at=0;for(const chunk of chunks){all.set(chunk,at);at+=chunk.length}raw=new TextDecoder().decode(all)}catch{return json({code:'invalid'},400)}
 let parsed;try{parsed=leadSchema.safeParse(JSON.parse(raw))}catch{return json({code:'invalid'},400)}if(!parsed.success)return json({code:'validation'},422);
 const d=parsed.data;const now=Date.now();if(d.website||now-d.startedAt<1800||now-d.startedAt>86400000)return json({code:'validation'},422);
 const db=env.DB;if(!db)return json({code:'unavailable'},503);
 try{
 const ip=request.headers.get('cf-connecting-ip')||'local';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+':'+Math.floor(now/900000)));const key=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
 const counter=await db.prepare('INSERT INTO rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+900000).first<{count:number}>();if(!counter||counter.count>8)return json({code:'rate_limit'},429);
 const fingerprint=await inquiryFingerprint(d);
 await db.prepare('INSERT OR IGNORE INTO leads (id,created_at,kind,first_name,email,phone,preferred_contact,city,province,postal_code,service,journey_stage,timeframe,message,language,source,landing_page,status,referral_status,consent_version,consent_at,marketing_consent,formspree_state,formspree_hash,care_for) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(d.requestId,now,d.kind,d.firstName,d.email,d.phone||null,d.preferredContact,d.city||null,d.province||null,d.postalCode||null,d.service||null,d.interest||null,d.timeframe||null,d.message||null,d.lang,d.source?JSON.stringify(d.source):null,d.kind==='care'?'/find-care':d.kind==='provider'?'/for-providers':'/contact','NEW','NOT_SHARED',d.consentVersion,now,d.marketing?1:0,'pending',fingerprint,d.who||null).run();
 const delivery=await deliverInquiry(db,d,fingerprint);
 if(delivery==='conflict')return json({code:'request_conflict'},409);
 if(delivery==='failed')return json({code:'delivery_failed',saved:true,reference:d.requestId},503);
 await db.batch([db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now),db.prepare('DELETE FROM leads WHERE created_at < ?').bind(now-90*86400000)]);
 return json({reference:d.requestId,providers:d.kind==='care'?filterProviders({city:d.city,service:d.service==='any'?'':d.service}):[],status:'saved',delivery});
 }catch{return json({code:'unavailable'},503)}
}
