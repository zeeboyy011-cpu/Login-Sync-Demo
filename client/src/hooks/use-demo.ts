import { useMutation } from "@tanstack/react-query";
import { api, buildUrl, type DemoLoginInput, type DemoLoginUpdateInput, type DemoLoginResponse } from "@shared/routes";

export function useCreateDemoLogin() {
  return useMutation({
    mutationFn: async (data: DemoLoginInput): Promise<DemoLoginResponse> => {
      const validated = api.demoLogins.create.input.parse(data);
      const res = await fetch(api.demoLogins.create.path, {
        method: api.demoLogins.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.demoLogins.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to initialize session");
      }
      
      return api.demoLogins.create.responses[201].parse(await res.json());
    },
  });
}

export function useUpdateDemoLogin() {
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & DemoLoginUpdateInput): Promise<DemoLoginResponse> => {
      const validated = api.demoLogins.update.input.parse(updates);
      const url = buildUrl(api.demoLogins.update.path, { id });
      
      const res = await fetch(url, {
        method: api.demoLogins.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.demoLogins.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) {
          throw new Error("Session not found");
        }
        throw new Error("Failed to update session");
      }

      return api.demoLogins.update.responses[200].parse(await res.json());
    },
  });
}
