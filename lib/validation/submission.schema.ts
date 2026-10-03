import { z } from "zod";

export const CreateSubmissionSchema = z.object({
  hackathonId: z.string().min(1),
  teamId: z.string().min(1),
  problemStatementId: z.string().optional(),
  projectTitle: z.string().min(3, "Project title must be at least 3 characters."),
  tagline: z.string().min(5, "Tagline required."),
  description: z.string().min(10, "Description required."),
  demoUrl: z.string().url("Must be a valid demo URL.").optional().or(z.literal("")),
  repoUrl: z.string().url("Must be a valid repository URL.").optional().or(z.literal("")),
});

export const EvaluateSubmissionSchema = z.object({
  score: z.number().min(0).max(100),
  criteriaBreakdown: z.record(z.number()).optional().default({}),
  notes: z.string().optional(),
});

export type CreateSubmissionDto = z.infer<typeof CreateSubmissionSchema>;
export type EvaluateSubmissionDto = z.infer<typeof EvaluateSubmissionSchema>;
