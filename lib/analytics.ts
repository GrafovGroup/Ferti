// Deliberately no network transport. Wire only a privacy-reviewed aggregate sink.
export type NavigationEvent='homepage_cta_clicked'|'matching_started'|'matching_completed'|'clinic_search_started'|'provider_profile_viewed'|'contact_request_completed';
export function recordNavigationEvent(_event:NavigationEvent):void {}
