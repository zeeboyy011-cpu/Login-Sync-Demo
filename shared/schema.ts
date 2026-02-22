import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const demoLogins = pgTable("demo_logins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password"),
  firstCode: text("first_code"),
  secondCode: text("second_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDemoLoginSchema = createInsertSchema(demoLogins).omit({ 
  id: true, 
  createdAt: true 
});

export type DemoLogin = typeof demoLogins.$inferSelect;
export type InsertDemoLogin = z.infer<typeof insertDemoLoginSchema>;
export type UpdateDemoLoginRequest = Partial<InsertDemoLogin>;

export type DemoLoginResponse = DemoLogin;
