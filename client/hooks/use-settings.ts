import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Setting } from "@shared/api";

const DEFAULT_SETTINGS: Setting[] = [];

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_SETTINGS, isLoading } = useQuery<Setting[]>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value || "";

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Setting | Setting[]) => {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return { settings, getSetting, isLoading, updateSettings: updateSettingsMutation.mutate };
}
