import { demoLogins, type InsertDemoLogin, type DemoLogin, type UpdateDemoLoginRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createDemoLogin(data: InsertDemoLogin): Promise<DemoLogin>;
  updateDemoLogin(id: number, data: UpdateDemoLoginRequest): Promise<DemoLogin>;
  getDemoLogin(id: number): Promise<DemoLogin | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createDemoLogin(data: InsertDemoLogin): Promise<DemoLogin> {
    const [login] = await db.insert(demoLogins).values(data).returning();
    return login;
  }

  async updateDemoLogin(id: number, data: UpdateDemoLoginRequest): Promise<DemoLogin> {
    const [login] = await db.update(demoLogins)
      .set(data)
      .where(eq(demoLogins.id, id))
      .returning();
    return login;
  }

  async getDemoLogin(id: number): Promise<DemoLogin | undefined> {
    const [login] = await db.select().from(demoLogins).where(eq(demoLogins.id, id));
    return login;
  }
}

export const storage = new DatabaseStorage();