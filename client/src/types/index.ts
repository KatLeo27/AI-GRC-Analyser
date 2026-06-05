export type Status = 'idle' | 'submitting' | 'success' | 'error';
export type Theme = 'light' | 'dark';
export type Page = 'landing' | 'login' | 'submit';

export interface VendorData {
  companyName: string;
  website: string;
  hqLocation: string;
  contactName: string;
  contactEmail: string;
  jobTitle: string;
}
