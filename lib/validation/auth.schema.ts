import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("A valid educational or professional email is required."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  name: z.string().min(2, "Name must be at least 2 characters long."),
  role: z.enum(["STUDENT", "ORGANIZER", "ADMIN", "JUDGE"]).default("STUDENT"),
  phone: z.string().optional(),

  // Optional Student Profile fields
  usnOrRollNo: z.string().optional(),
  collegeName: z.string().optional(),
  universityName: z.string().optional(),
  district: z.string().optional(),
  graduationYear: z.number().int().optional(),
  degreeBranch: z.string().optional(),

  // Optional Organizer Profile fields
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
  designation: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Valid email required."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
