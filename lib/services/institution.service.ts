import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";

export class InstitutionService {
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


    const [institutions, total] = await Promise.all([
      prisma.institution.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.institution.count({ where }),
    ]);


    return {
      data: institutions.map((inst) => ({
        ...inst,
        location: {
          district: inst.district,
          city: inst.city || undefined,
          locality: inst.locality || undefined,
          address: inst.address || undefined,
          latitude: inst.latitude,
          longitude: inst.longitude,
        },
        coursesAvailable: JSON.parse(inst.coursesAvailable || "[]"),
        technologyClubs: JSON.parse(inst.technologyClubs || "[]"),
        upcomingEvents: [],
        lastUpdated: inst.lastUpdated.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + institutions.length < total,
    };
  }

  static async getById(idOrShortCode: string) {
    const inst = await prisma.institution.findFirst({
      where: {
        OR: [{ id: idOrShortCode }, { shortCode: idOrShortCode }],
      },
    });

    if (!inst) {
      throw AppError.notFound(`Institution "${idOrShortCode}" was not found.`);
    }

    return {
      ...inst,
      location: {
        district: inst.district,
        city: inst.city || undefined,
        locality: inst.locality || undefined,
        address: inst.address || undefined,
        latitude: inst.latitude,
        longitude: inst.longitude,
      },
      coursesAvailable: JSON.parse(inst.coursesAvailable || "[]"),
      technologyClubs: JSON.parse(inst.technologyClubs || "[]"),
      upcomingEvents: [],
      lastUpdated: inst.lastUpdated.toISOString(),
    };
  }
}
