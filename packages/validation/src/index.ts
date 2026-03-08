import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  displayName: z.string().min(2).max(64)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12)
});

export const journalEntrySchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(1),
  entryType: z.enum(["journal", "diary", "note"]),
  mood: z.string().max(60).optional(),
  intensity: z.number().min(1).max(10).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
