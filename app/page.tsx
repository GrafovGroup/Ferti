import { HomePage } from '@/components/ferti/pages';
import { origin, businessPhone } from '@/lib/site';
export const metadata={alternates:{canonical:origin,languages:{'en-CA':origin,'fr-CA':origin+'/fr','x-default':origin}}};
export default function Home(){const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization',name:'Ferti',url:origin,telephone:businessPhone.e164,description:'Canadian fertility information and provider discovery.'},{'@type':'WebSite',name:'Ferti',url:origin,inLanguage:['en-CA','fr-CA']}]};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><HomePage lang="en"/></>;}
