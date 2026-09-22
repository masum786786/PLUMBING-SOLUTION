export type Language = "en" | "ar";

export interface ServiceItem {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  tagKey: string;
}

export interface ProjectItem {
  id: string;
  titleKey: string;
  category: "all" | "buildings" | "apartments" | "houses" | "plumbing";
  categoryKey: string;
  locationKey: string;
  descKey: string;
  image: string;
  statsKey: string;
}

export interface WhyChooseItem {
  id: string;
  titleKey: string;
  descKey: string;
  iconName: string;
}

export interface LeadershipMember {
  name: string;
  roleKey: string;
  experienceKey: string;
  locationKey: string;
  phone: string;
  image: string;
}

export interface ServiceRequest {
  id: string;
  full_name: string;
  address: string;
  mobile: string;
  work_details: string;
  status: "New" | "Contacted" | "Completed";
  created_at: string;
}
