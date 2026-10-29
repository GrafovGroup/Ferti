import data from './locations.json';
import { coverage } from './coverage';
import { filterProviders } from './providers';
export const locations = data;
export type Location = typeof locations[number];
export const locationBySlug = (slug:string) => locations.find(c=>c.slug===slug);
export const provinceBySlug = (slug:string) => coverage.find(p=>p.slug===slug);
// Disambiguate distinct 2021 census subdivisions sharing a municipality name.
const distinctCityIds:Record<string,string>={'ontario:hamilton':'3525005','new-brunswick:moncton':'1307022'};
export const localProviders = (c:Location) => {const key=c.province+':'+c.name.toLowerCase();const id=distinctCityIds[key];return id&&id!==c.id?[]:filterProviders({city:c.name,province:provinceBySlug(c.province)!.en});};
// Index only location pages supported by checked local provider information.
// Other municipalities remain browsable, but do not create thousands of thin search landing pages.
export const indexableLocation = (c:Location) => localProviders(c).length > 0;
export const geographySource = 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810000201';
