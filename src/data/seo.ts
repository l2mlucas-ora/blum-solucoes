import { site, whatsapp, abs } from "./site";
import { r, type Lang, type T } from "../i18n/routes";

export interface Crumb { name: string; href: string }
export interface Faq { q: string; a: string }

const ORG_ID = `${site.url}/#empresa`;
const INICIO: T = { pt: "Início", en: "Home", es: "Inicio" };
const DESC: T = {
  pt: "Elétrica residencial e comercial, câmeras de segurança, controle de acesso, fechaduras digitais, alarmes e iluminação em Garopaba e região.",
  en: "Residential and commercial electrical work, security cameras, access control, smart locks, alarms and lighting in Garopaba, Santa Catarina, Brazil.",
  es: "Electricidad residencial y comercial, cámaras de seguridad, control de acceso, cerraduras digitales, alarmas e iluminación en Garopaba y región.",
};
const area = () => site.regiao.map((c) => ({ "@type": "Place", name: `${c}, SC` }));

export function organizationLd(lang: Lang = "pt") {
  return {
    "@context": "https://schema.org",
    "@type": ["Electrician", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.nome,
    ...(site.razaoSocial && { legalName: site.razaoSocial }),
    ...(site.cnpj && { taxID: site.cnpj }),
    url: abs("/"),
    logo: `${site.url}/img/logo-simbolo.svg`,
    image: `${site.url}/img/og-blum.jpg`,
    description: DESC[lang],
    telephone: `+${whatsapp.numero}`,
    address: { "@type": "PostalAddress", addressLocality: site.endereco.cidade, addressRegion: site.endereco.uf, addressCountry: "BR" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: site.horario.semana[0], closes: site.horario.semana[1] },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: site.horario.sabado[0], closes: site.horario.sabado[1] },
    ],
    areaServed: area(),
    knowsLanguage: ["pt-BR", "en", "es"],
    priceRange: "$$",
    sameAs: [site.redes.instagram],
  };
}

export function breadcrumbLd(crumbs: Crumb[], lang: Lang = "pt") {
  const all = [{ name: INICIO[lang], href: r("home", lang) }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.href) })),
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") } })),
  };
}

export function serviceLd(o: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: o.name,
    serviceType: o.name,
    description: o.description,
    url: abs(o.path),
    provider: { "@id": ORG_ID },
    areaServed: area(),
  };
}
