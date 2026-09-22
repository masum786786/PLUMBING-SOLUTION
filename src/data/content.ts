import { ServiceItem, ProjectItem, WhyChooseItem, LeadershipMember } from "../types";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "building-plumbing",
    titleKey: "services.building.title",
    descKey: "services.building.desc",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.commercial",
  },
  {
    id: "apartment-plumbing",
    titleKey: "services.apartment.title",
    descKey: "services.apartment.desc",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.residential",
  },
  {
    id: "house-plumbing",
    titleKey: "services.house.title",
    descKey: "services.house.desc",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.residential",
  },
  {
    id: "plumbing-installation",
    titleKey: "services.installation.title",
    descKey: "services.installation.desc",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.technical",
  },
  {
    id: "plumbing-maintenance",
    titleKey: "services.maintenance.title",
    descKey: "services.maintenance.desc",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.preventive",
  },
  {
    id: "plumbing-repair",
    titleKey: "services.repair.title",
    descKey: "services.repair.desc",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
    tagKey: "services.tags.emergency",
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-1",
    titleKey: "projects.p1.title",
    category: "buildings",
    categoryKey: "projects.categories.buildings",
    locationKey: "projects.locations.riyadh",
    descKey: "projects.p1.desc",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p1.stats",
  },
  {
    id: "proj-2",
    titleKey: "projects.p2.title",
    category: "apartments",
    categoryKey: "projects.categories.apartments",
    locationKey: "projects.locations.jeddah",
    descKey: "projects.p2.desc",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p2.stats",
  },
  {
    id: "proj-3",
    titleKey: "projects.p3.title",
    category: "houses",
    categoryKey: "projects.categories.houses",
    locationKey: "projects.locations.dammam",
    descKey: "projects.p3.desc",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p3.stats",
  },
  {
    id: "proj-4",
    titleKey: "projects.p4.title",
    category: "plumbing",
    categoryKey: "projects.categories.plumbing",
    locationKey: "projects.locations.khobar",
    descKey: "projects.p4.desc",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p4.stats",
  },
  {
    id: "proj-5",
    titleKey: "projects.p5.title",
    category: "buildings",
    categoryKey: "projects.categories.buildings",
    locationKey: "projects.locations.makkah",
    descKey: "projects.p5.desc",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p5.stats",
  },
  {
    id: "proj-6",
    titleKey: "projects.p6.title",
    category: "apartments",
    categoryKey: "projects.categories.apartments",
    locationKey: "projects.locations.medina",
    descKey: "projects.p6.desc",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    statsKey: "projects.p6.stats",
  },
];

export const WHY_CHOOSE_DATA: WhyChooseItem[] = [
  {
    id: "why-1",
    titleKey: "why.w1.title",
    descKey: "why.w1.desc",
    iconName: "Award",
  },
  {
    id: "why-2",
    titleKey: "why.w2.title",
    descKey: "why.w2.desc",
    iconName: "CheckCircle2",
  },
  {
    id: "why-3",
    titleKey: "why.w3.title",
    descKey: "why.w3.desc",
    iconName: "Users",
  },
  {
    id: "why-4",
    titleKey: "why.w4.title",
    descKey: "why.w4.desc",
    iconName: "MapPin",
  },
  {
    id: "why-5",
    titleKey: "why.w5.title",
    descKey: "why.w5.desc",
    iconName: "ShieldCheck",
  },
  {
    id: "why-6",
    titleKey: "why.w6.title",
    descKey: "why.w6.desc",
    iconName: "Clock",
  },
  {
    id: "why-7",
    titleKey: "why.w7.title",
    descKey: "why.w7.desc",
    iconName: "Building2",
  },
  {
    id: "why-8",
    titleKey: "why.w8.title",
    descKey: "why.w8.desc",
    iconName: "HeartHandshake",
  },
];

export const LEADERSHIP_DATA: LeadershipMember[] = [
  {
    name: "Khalil Ahmad",
    roleKey: "leadership.khalil.role",
    experienceKey: "leadership.khalil.exp",
    locationKey: "common.saudiArabia",
    phone: "+966572547358",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    name: "Wasi Ahmad",
    roleKey: "leadership.wasi.role",
    experienceKey: "leadership.wasi.exp",
    locationKey: "common.saudiArabia",
    phone: "+966573157610",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
  },
];
