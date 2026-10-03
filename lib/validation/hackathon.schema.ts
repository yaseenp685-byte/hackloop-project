import { z } from "zod";

export const CreateHackathonSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  tagline: z.string().min(5, "Tagline must be at least 5 characters."),
  format: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).default("HYBRID"),
  district: z.string().min(2, "Karnataka district is required."),
  city: z.string().optional(),
  locality: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional().default(12.9716),
  longitude: z.number().optional().default(77.5946),
  description: z.string().min(20, "Detailed description required."),
  theme: z.array(z.string()).min(1, "At least one theme/track required."),
  technologies: z.array(z.string()).min(1, "At least one technology required."),
  eligibility: z.string().min(5, "Eligibility criteria required."),
  minTeamSize: z.number().int().min(1).default(1),
  maxTeamSize: z.number().int().min(1).max(10).default(4),
  registrationDeadline: z.string().datetime(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  rules: z.array(z.string()).optional().default([]),
  problemStatements: z
    .array(
      z.object({
        title: z.string().min(3),
        category: z.string(),
        description: z.string(),
        sponsorOrCompany: z.string().optional(),
        deliverables: z.array(z.string()).optional(),
        trackPrize: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  prizes: z
    .array(
      z.object({
        place: z.string(),
        amount: z.string(),
        perks: z.array(z.string()).optional(),
        description: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export const UpdateStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "REVIEW",
    "PUBLISHED",
    "Registration Open",
    "Registration Closing Soon",
    "Registration Closed",
    "Event Live",
    "Submission Open",
    "Submission Closed",
    "Judging",
    "Results Published",
    "COMPLETED",
    "ARCHIVED",
  ]),
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(5, "Content must be at least 5 characters."),
  priority: z.enum(["NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  sentToEmail: z.boolean().optional().default(false),
});

export type CreateHackathonDto = z.infer<typeof CreateHackathonSchema>;
export type CreateAnnouncementDto = z.infer<typeof CreateAnnouncementSchema>;
