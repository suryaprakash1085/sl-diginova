import { useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";

export function ThemeInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    
    settings.forEach((setting) => {
      if (setting.key === "primary_color") {
        // Convert hex to HSL if possible or just use hex
        // For Tailwind to work with hsl(var(--primary)), we need the values
        // But for simplicity, we can just set the raw color if we update tailwind config to use the var
        root.style.setProperty("--primary-custom", setting.value);
      }
      if (setting.key === "secondary_color") {
        root.style.setProperty("--secondary-custom", setting.value);
      }
      if (setting.key === "button_color") {
        root.style.setProperty("--button-custom", setting.value);
      }
      if (setting.key === "text_color") {
        root.style.setProperty("--text-custom", setting.value);
      }
      if (setting.key === "font_family") {
        root.style.setProperty("--font-family-custom", setting.value);
      }
      if (setting.key === "font_size") {
        root.style.setProperty("--font-size-custom", setting.value);
      }
      if (setting.key === "bg_color") {
        root.style.setProperty("--bg-custom", setting.value);
      }
      if (setting.key === "bg_image") {
        root.style.setProperty("--bg-image-custom", `url(${setting.value})`);
      }
      if (setting.key === "bg_type") {
        root.setAttribute("data-bg-type", setting.value);
      }
    });
  }, [settings]);

  return null;
}
