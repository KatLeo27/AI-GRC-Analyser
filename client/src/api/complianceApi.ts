import axios from 'axios';
import { VendorData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function submitCompliance(vendor: VendorData, file: File): Promise<void> {
  const form = new FormData();
  form.append('companyName',  vendor.companyName);
  form.append('website',      vendor.website);
  form.append('hqLocation',   vendor.hqLocation);
  form.append('contactName',  vendor.contactName);
  form.append('contactEmail', vendor.contactEmail);
  form.append('jobTitle',     vendor.jobTitle);
  form.append('file', file);

  try {
    await axios.post(`${API_BASE}/api/compliance`, form);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.error?.message ?? err.message;
      throw new Error(message);
    }
    throw err;
  }
}
