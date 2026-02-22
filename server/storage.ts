import { type InsertDemoLogin, type DemoLogin, type UpdateDemoLoginRequest } from "@shared/schema";

export interface IStorage {
  createDemoLogin(data: InsertDemoLogin): Promise<DemoLogin>;
  updateDemoLogin(id: number, data: UpdateDemoLoginRequest): Promise<DemoLogin>;
  getDemoLogin(id: number): Promise<DemoLogin | undefined>;
}

export class MemStorage implements IStorage {
  private demoLogins: Map<number, DemoLogin>;
  private currentId: number;

  constructor() {
    this.demoLogins = new Map();
    this.currentId = 1;
  }

  async createDemoLogin(data: InsertDemoLogin): Promise<DemoLogin> {
    const id = this.currentId++;
    const login: DemoLogin = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      password: data.password || null,
      firstCode: data.firstCode || null,
      secondCode: data.secondCode || null,
    };
    this.demoLogins.set(id, login);
    return login;
  }

  async updateDemoLogin(id: number, data: UpdateDemoLoginRequest): Promise<DemoLogin> {
    const existing = this.demoLogins.get(id);
    if (!existing) {
      throw new Error("Login record not found");
    }
    const updated = { ...existing, ...data };
    this.demoLogins.set(id, updated);
    return updated;
  }

  async getDemoLogin(id: number): Promise<DemoLogin | undefined> {
    return this.demoLogins.get(id);
  }
}

export const storage = new MemStorage();
