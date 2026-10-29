import type { Inquiry } from './inquiry';
export const formspreeEndpoint='https://formspree.io/f/mqpaeazb';
export function formspreePayload(d:Inquiry){
 return {
  _subject:`Ferti.ca — ${d.kind==='care'?'Care request':d.kind==='provider'?'Provider inquiry':'Contact message'} — ${d.lang.toUpperCase()}`,
  name:d.firstName,email:d.email,phone:d.phone,preferred_contact:d.preferredContact,
  inquiry_type:d.kind,reference:d.requestId,language:d.lang,
  city:d.city,province:d.province,postal_code:d.postalCode,
  interest:d.interest,service:d.service,care_for:d.who,timeframe:d.timeframe,message:d.message,
  consent:'Yes — handle enquiry and follow up; process using Formspree. No clinic sharing without further consent.',
  consent_version:d.consentVersion,marketing_consent:d.marketing?'Yes':'No',
  source:d.source?JSON.stringify(d.source):'',
  page:(d.lang==='fr'?'/fr':'')+(d.kind==='care'?'/find-care':d.kind==='provider'?'/for-providers':'/contact'),
 };
}
export async function inquiryFingerprint(d:Inquiry){
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(formspreePayload(d))));
 return Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
export type Delivery='sent'|'failed'|'unconfirmed'|'conflict';
export async function deliverInquiry(db:D1Database,d:Inquiry,hash:string,send:typeof fetch=fetch):Promise<Delivery>{
 const existing=await db.prepare('SELECT formspree_hash,formspree_state FROM leads WHERE id=?').bind(d.requestId).first<{formspree_hash:string|null,formspree_state:string}>();
 if(!existing||existing.formspree_hash!==hash)return 'conflict';
 if(existing.formspree_state==='sent')return 'sent';
 const claim=await db.prepare("UPDATE leads SET formspree_state='sending' WHERE id=? AND formspree_hash=? AND formspree_state IN ('pending','failed') RETURNING id").bind(d.requestId,hash).first();
 if(!claim)return 'unconfirmed';
 let state:Delivery='unconfirmed';
 try{
  const response=await send(formspreeEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(formspreePayload(d)),signal:AbortSignal.timeout(12000),redirect:'manual'});
  if(response.ok){const body=await response.json() as {ok?:boolean};state=body.ok===true?'sent':'unconfirmed';}
  else state=response.status>=400&&response.status<500?'failed':'unconfirmed';
 }catch(error){/* A timeout may occur after acceptance. Do not resend automatically. */ console.warn('formspree_delivery_unconfirmed',error instanceof Error?error.name:'NetworkError');}
 try{await db.prepare('UPDATE leads SET formspree_state=? WHERE id=?').bind(state,d.requestId).run();}catch{return 'unconfirmed';}
 return state;
}
