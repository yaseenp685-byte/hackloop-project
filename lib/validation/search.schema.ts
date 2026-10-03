import { z } from "zod";

export const SearchQuerySchema = z.object({
  query: z.string().optional().default(""),
  filters: z
    .object({
      category: z.enum(["ALL", "HACKATHONS", "COLLEGES", "UNIVERSITIES", "COMPANIES", "COMMUNITIES"]).optional().default("ALL"),
      district: z.string().optional(),
      radiusKm: z.number().positive().max(500).optional(),
      userCoords: z
        .object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
        })
        .optional(),
      technologies: z.array(z.string()).optional().default([]),
      eventFormat: z.enum(["ALL", "ONLINE", "OFFLINE", "HYBRID"]).optional().default("ALL"),
      verificationStatus: z.enum(["ALL", "VERIFIED", "PENDING", "UNVERIFIED", "STALE_NEEDS_UPDATE"]).optional().default("ALL"),
      sortBy: z.enum(["relevance", "distance_asc", "date_asc", "date_desc", "deadline_soon", "popular"]).optional().default("relevance"),
    })
    .optional()
    .default({}),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(50).optional().default(10),
});

export const SearchParamsSchema = SearchQuerySchema;
export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;
export type SearchParamsDto = SearchQueryParams;

