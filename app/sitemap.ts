import {locations,indexableLocation} from '@/content/locations';
import type {MetadataRoute} from 'next';
import {services} from '@/content/services';
import {providers,cities} from '@/content/providers';
import {articles} from '@/content/articles';
import {infoPages} from '@/content/trust';
import {coverage} from '@/content/coverage';
import {origin} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{const paths=['','/locations','/clinics','/learn','/cost','/coverage','/faqs',...services.map(s=>'/'+s.slug),...providers.map(p=>'/providers/'+p.slug),...locations.filter(indexableLocation).map(c=>'/clinics/'+c.slug),...coverage.map(p=>'/locations/'+p.slug),...articles.map(a=>'/learn/'+a.slug),...infoPages.map(p=>'/'+p.slug),...coverage.map(c=>'/coverage/'+c.slug),...['ivf','iui','egg-freezing','semen-analysis','sperm-freezing'].map(s=>'/cost/'+s)];return paths.flatMap(path=>['','/fr'].map(locale=>({url:origin+locale+path,lastModified:'2026-09-19',alternates:{languages:{'en-CA':origin+path,'fr-CA':origin+'/fr'+path}}})));}
