import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";

export class CommunityService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    type?: string;
    district?: string;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;


    const where: any = {};
    if (params.type && params.type !== "ALL") {
      where.type = params.type;
    }
    if (params.district && params.district !== "ALL") {
      where.district = { contains: params.district };
    }


    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        take: pageSize,
        orderBy: { memberCount: "desc" },
      }),
      prisma.community.count({ where }),
    ]);


    return {
      data: communities.map((comm) => ({
        ...comm,
        location: {
          district: comm.district,
          city: comm.city || undefined,
        },
        technologies: JSON.parse(comm.technologies || "[]"),
        socialLinks: JSON.parse(comm.socialLinks || "{}"),
        lastUpdated: comm.lastUpdated.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + communities.length < total,
    };
  }


  static async getById(id: string) {
    const comm = await prisma.community.findUnique({
      where: { id },
    });

    if (!comm) {
      throw AppError.notFound(`Community "${id}" was not found.`);
    }


    return {
      ...comm,
      location: {
        district: comm.district,
        city: comm.city || undefined,
      },
      technologies: JSON.parse(comm.technologies || "[]"),
      socialLinks: JSON.parse(comm.socialLinks || "{}"),
      lastUpdated: comm.lastUpdated.toISOString(),
    };
  }
}
