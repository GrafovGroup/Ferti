import type {MetadataRoute} from 'next';
import {origin} from '@/lib/site';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/find-care','/fr/find-care']},sitemap:origin+'/sitemap.xml'};}
