import type { Lang } from './shell';
export const imagery:Record<string,{file:string;alt:[string,string]}>={
 'first-appointment':{file:'guide-first-appointment',alt:['A patient speaking with a clinician in a consultation room.','Une patiente discute avec une professionnelle dans une salle de consultation.']},
 'treatment-options':{file:'guide-treatment-options',alt:['A clinician and patient discussing fertility care options.','Une professionnelle et une patiente discutent des options de soins de fertilité.']},
 'cost-planning':{file:'guide-cost-planning',alt:['A notebook and calculator on a desk for planning expenses.','Un carnet et une calculatrice sur un bureau pour planifier les dépenses.']},
 'travel-planning':{file:'guide-travel-planning',alt:['A traveller looking out of a train window.','Une personne en voyage regarde par la fenêtre d’un train.']},
 'emotional-support':{file:'guide-emotional-support',alt:['Two adults talking in a calm, supportive setting.','Deux adultes discutent dans un espace calme et accueillant.']},
 'donor-conversation':{file:'guide-donor-conversation',alt:['Two adults discussing family-building options at a table.','Deux adultes discutent des options pour fonder une famille autour d’une table.']},
 'ivf':{file:'ivf-embryology',alt:['An illustrative embryology laboratory scene with a microscope and culture dish.','Scène illustrative de laboratoire d’embryologie avec microscope et boîte de culture.']},
 'egg-freezing':{file:'egg-freezing',alt:['A technician handling specimen storage in an illustrative cryopreservation laboratory.','Manipulation d’échantillons dans un laboratoire illustratif de cryoconservation.']},
 'fertility-testing':{file:'fertility-testing',alt:['Gloved hands preparing laboratory samples for testing.','Mains gantées préparant des échantillons pour des analyses.']},
 'reproductive-urology':{file:'reproductive-urology',alt:['An illustrative consultation about male reproductive health.','Consultation illustrative sur la santé reproductive masculine.']},
 'donor-eggs':{file:'donor-conception',alt:['A person reflecting on family-building options with a notebook and tablet.','Une personne réfléchit aux options pour fonder une famille avec un carnet et une tablette.']},
 'home-female':{file:'female-fertility-consultation',alt:['An illustrative fertility consultation between an adult woman and a clinician.','Consultation illustrative de fertilité entre une femme adulte et une professionnelle.']},
 'home-male':{file:'male-fertility-consultation',alt:['An adult man discussing fertility testing with a clinician in an illustrative consultation.','Un homme adulte discute des examens de fertilité avec un professionnel dans une consultation illustrative.']},
 'home-family':{file:'partners-family-planning',alt:['Two women exploring family-planning information together at home.','Deux femmes explorent ensemble les informations sur la planification familiale à la maison.']}
};
const aliases:Record<string,string>={
 'your-first-fertility-appointment':'first-appointment','understanding-semen-analysis':'home-male','questions-about-fertility-costs':'cost-planning','family-building-on-your-terms':'home-family',
 'ivf-vs-iui':'treatment-options','fertility-testing-what-to-expect':'fertility-testing','egg-freezing-questions':'egg-freezing','donor-sperm-eggs-canada':'donor-conversation','fertility-care-travel-and-monitoring':'travel-planning','emotional-support-fertility-care':'emotional-support',
 'female-fertility':'home-female','male-fertility':'home-male','iui':'treatment-options','sperm-freezing':'egg-freezing','semen-analysis':'fertility-testing','male-fertility-testing':'home-male','fertility-preservation':'egg-freezing','donor-sperm':'donor-conversation',
 'about':'emotional-support','how-it-works':'first-appointment','for-providers':'treatment-options','cost':'cost-planning','coverage':'cost-planning'
};
export function EditorialImage({id,lang='en',compact=false}:{id:string,lang?:Lang,compact?:boolean}){const im=imagery[id]||imagery[aliases[id]];if(!im)return null;return <figure className={compact?'editorial-image compact':'editorial-image'}><img src={`/images/${im.file}.webp`} srcSet={`/images/${im.file}-small.webp 640w, /images/${im.file}.webp 1200w`} sizes={compact?'(max-width:600px) 90vw, 30vw':'(max-width:750px) 90vw, 65vw'} alt={im.alt[lang==='fr'?1:0]} width={1200} height={800} loading="lazy" decoding="async"/>{!compact&&<figcaption>{lang==='fr'?'Illustration éditoriale créée par IA; ne représente pas une clinique ni un patient réel.':'AI-created editorial illustration; does not depict a specific clinic or real patient.'}</figcaption>}</figure>}
