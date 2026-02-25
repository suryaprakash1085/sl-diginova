import { User, Product, ContactMessage, Setting } from "@shared/api";

// Simple in-memory database
export const db = {
  users: [] as User[],
  products: [] as Product[],
  messages: [] as ContactMessage[],
  settings: [] as Setting[],
};

// Initial data (Seed)
db.users.push({
  id: "1",
  username: "admin",
  role: "admin",
  createdAt: new Date().toISOString(),
}, {
  id: "2",
  username: "jane_doe",
  role: "user",
  createdAt: new Date().toISOString(),
});

// Seed Products
db.products.push({
  id: "p1",
  name: "Premium Headphones",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
  description: "High-quality wireless noise-canceling headphones.",
  price: 299,
}, {
  id: "p2",
  name: "Smart Watch",
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500",
  description: "Stay connected and track your fitness with our smart watch.",
  price: 199,
});

// Seed Contact Messages
db.messages.push({
  id: "m1",
  name: "John Smith",
  email: "john@example.com",
  phone: "123-456-7890",
  message: "I'm interested in your premium headphones. Do you have any discounts available?",
  date: new Date().toISOString(),
});

// Default settings
const defaultSettings: Setting[] = [
  { key: "banner_title", value: "Welcome to Our Store" },
  { key: "banner_description", value: "Discover amazing products and great deals." },
  { key: "button_text", value: "Shop Now" },
  // About page keys
  { key: "company_description", value: "We are a leading technology company focused on delivering high-quality products to our customers." },
  { key: "mission", value: "To innovate and provide the best user experience through our products." },
  { key: "vision", value: "To become the global standard for quality and reliability in the tech industry." },
  { key: "team_details", value: "Our team consists of passionate engineers and designers from all over the world." },
  // Global customization
  { key: "company_name", value: "Fusion Brand" },
  { key: "company_email", value: "contact@mybrand.com" },
  { key: "company_phone", value: "+1 234 567 890" },
  { key: "company_address", value: "123 Street, City, Country" },
  { key: "primary_color", value: "#3b82f6" },
  { key: "secondary_color", value: "#6366f1" },
  { key: "button_color", value: "#3b82f6" },
  { key: "header_bg_color", value: "#ffffff" },
  { key: "footer_bg_color", value: "#f8fafc" },
  { key: "text_color", value: "#0f172a" },
  { key: "font_family", value: "Inter" },
  { key: "font_size", value: "16px" },
  { key: "show_top_bar", value: "true" },
  { key: "show_footer", value: "true" },
  { key: "sticky_header", value: "true" },
  { key: "dark_mode", value: "false" },
];

db.settings.push(...defaultSettings);

// Helpers
export const getSetting = (key: string) => db.settings.find(s => s.key === key)?.value;
export const updateSetting = (key: string, value: string) => {
  const index = db.settings.findIndex(s => s.key === key);
  if (index !== -1) {
    db.settings[index].value = value;
  } else {
    db.settings.push({ key, value });
  }
};
