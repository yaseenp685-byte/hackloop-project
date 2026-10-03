import { z } from "zod";

export const CreateTeamSchema = z.object({
  hackathonId: z.string().min(1, "Hackathon ID is required."),
  name: z.string().min(2, "Team name must be at least 2 characters.").max(50),
  description: z.string().max(300).optional(),
});

export const InviteMemberSchema = z.object({
  invitedEmailOrUsn: z.string().min(3, "College email or USN is required."),
});

export const JoinTeamSchema = z.object({
  inviteCode: z.string().min(4, "Valid invite code required."),
});

export type CreateTeamDto = z.infer<typeof CreateTeamSchema>;
export type InviteMemberDto = z.infer<typeof InviteMemberSchema>;
export type JoinTeamDto = z.infer<typeof JoinTeamSchema>;
