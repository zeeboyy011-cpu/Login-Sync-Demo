import { z } from 'zod';
import { insertDemoLoginSchema, demoLogins } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  demoLogins: {
    create: {
      method: 'POST' as const,
      path: '/api/demo-logins' as const,
      input: insertDemoLoginSchema,
      responses: {
        201: z.custom<typeof demoLogins.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/demo-logins/:id' as const,
      input: insertDemoLoginSchema.partial(),
      responses: {
        200: z.custom<typeof demoLogins.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type DemoLoginInput = z.infer<typeof api.demoLogins.create.input>;
export type DemoLoginUpdateInput = z.infer<typeof api.demoLogins.update.input>;
export type DemoLoginResponse = z.infer<typeof api.demoLogins.create.responses[201]>;
