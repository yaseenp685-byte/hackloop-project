import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";

export class CompanyService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    industry?: string;
    district?: string;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;


    const where: any = {};
    if (params.industry && params.industry !== "ALL") {
      where.industry = { contains: params.industry };
    }
    if (params.district && params.district !== "ALL") {
      where.district = { contains: params.district };
    }


    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: pageSize,
        include: { opportunities: true },
        orderBy: { name: "asc" },
      }),
      prisma.company.count({ where }),
    ]);


    return {
      data: companies.map((c) => ({
        ...c,
        location: {
          district: c.district,
          city: c.city || undefined,
          locality: c.locality || undefined,
          address: c.address || undefined,
          latitude: c.latitude,
          longitude: c.longitude,
        },
        technologyAreas: JSON.parse(c.technologyAreas || "[]"),
        opportunities: c.opportunities.map((o) => ({
          ...o,
          technologies: JSON.parse(o.technologies || "[]"),
          deadline: o.deadline ? o.deadline.toISOString() : undefined,
          createdAt: o.createdAt.toISOString(),
        })),
        lastUpdated: c.lastUpdated.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + companies.length < total,
    };
  }

  static async getById(id: string) {
    const comp = await prisma.company.findUnique({
      where: { id },
      include: { opportunities: true },
    });

    if (!comp) {
      throw AppError.notFound(`Company "${id}" was not found.`);
    }


    return {
      ...comp,
      location: {
        district: comp.district,
        city: comp.city || undefined,
        locality: comp.locality || undefined,
        address: comp.address || undefined,
        latitude: comp.latitude,
        longitude: comp.longitude,
      },
      technologyAreas: JSON.parse(comp.technologyAreas || "[]"),
      opportunities: comp.opportunities.map((o) => ({
        ...o,
        technologies: JSON.parse(o.technologies || "[]"),
        deadline: o.deadline ? o.deadline.toISOString() : undefined,
        createdAt: o.createdAt.toISOString(),
      })),
      lastUpdated: comp.lastUpdated.toISOString(),
    };
  }
}
