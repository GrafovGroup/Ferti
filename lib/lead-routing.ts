// Routing is separate from discovery. A directory listing does not authorize
// disclosure. Call only after a provider agreement and additional sharing consent.
export type Referral={leadId:string;providerId:string;sharingConsentId:string};
export interface LeadRoutingAdapter { sendReferral(referral:Referral):Promise<{externalId:string}> }
export interface LeadRepository { assign(leadId:string,providerId:string):Promise<void>; setStatus(leadId:string,status:'NEW'|'CONTACTED'|'MATCHED'|'REFERRED'|'CLOSED'|'UNQUALIFIED'):Promise<void> }
