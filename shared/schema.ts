import { z } from "zod";

export const insertDemoLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  firstCode: z.string().optional(),
  secondCode: z.string().optional(),
});

export type InsertDemoLogin = z.infer<typeof insertDemoLoginSchema>;

export interface DemoLogin {
  id: number;
  email: string;
  password?: string | null;
  firstCode?: string | null;
  secondCode?: string | null;
  createdAt: string;
}

export type UpdateDemoLoginRequest = Partial<InsertDemoLogin>;
export type DemoLoginResponse = DemoLogin;
