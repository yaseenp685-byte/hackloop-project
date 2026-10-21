import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  tagline: z.string().min(5, "Tagline must be at least 5 characters").max(150),
  description: z.string().min(20, "Description must be at least 20 characters").max(3000),
  category: z.enum(["WEB_APP", "MOBILE", "AI_ML", "OPEN_SOURCE", "IOT", "CYBERSECURITY"]).default("WEB_APP"),
  technologies: z.array(z.string()).min(1, "Specify at least one technology"),
  repoUrl: z.string().url("Valid repository URL required").optional().or(z.literal("")),
  demoUrl: z.string().url("Valid live demo URL required").optional().or(z.literal("")),
  imageUrl: z.string().url("Valid image URL required").optional().or(z.literal("")),
});

export const JoinTeamRequestSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  role: z.enum(["Frontend", "Backend", "Fullstack", "AI/ML", "UI/UX", "Mobile", "DevOps"]).default("Frontend"),
  message: z.string().max(300).optional(),
});

export const HandleJoinRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  action: z.enum(["ACCEPT", "REJECT"]),
});

export const UpdateRecruitmentSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  projectIdea: z.string().max(500).optional(),
  requiredRoles: z.array(z.string()).default([]),
  isOpenForMembers: z.boolean().default(true),
});

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type JoinTeamRequestDto = z.infer<typeof JoinTeamRequestSchema>;
export type HandleJoinRequestDto = z.infer<typeof HandleJoinRequestSchema>;
export type UpdateRecruitmentDto = z.infer<typeof UpdateRecruitmentSchema>;
