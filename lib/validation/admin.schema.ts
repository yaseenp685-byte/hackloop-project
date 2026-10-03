import { z } from "zod";

export const VerificationDecisionSchema = z.object({
  decision: z.enum(["VERIFIED", "REJECTED", "PENDING", "STALE_NEEDS_UPDATE"]),
  notes: z.string().optional(),
});

export const ResolveModerationSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
  resolutionNotes: z.string().min(3, "Resolution notes are required."),
});

export type VerificationDecisionDto = z.infer<typeof VerificationDecisionSchema>;
export type ResolveModerationDto = z.infer<typeof ResolveModerationSchema>;
