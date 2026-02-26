/**
 * Shared code between client and server
 * Useful to share types between client and server
 */

export interface User {
  id: string;
  username: string;
  password?: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price?: number;
  icon?: string;
  subtitle?: string;
  features?: string;
  tech?: string;
  status?: "Active" | "Inactive" | "Draft";
  category?: string;
  dateAdded?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface Setting {
  id?: number;
  page_name: string;
  key: string;
  value?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User | null;
  token?: string;
  message?: string;
}

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalMessages: number;
}
