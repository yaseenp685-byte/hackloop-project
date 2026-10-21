import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const district = searchParams.get("district") || undefined;

    const where: any = {};

    if (type && type !== "ALL") {
      where.type = type;
    }

    if (district && district !== "ALL") {
      where.company = {
        district: { contains: district },
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { location: { contains: q } },
        { technologies: { contains: q } },
        { company: { name: { contains: q } } },
      ];
    }

    const items = await prisma.companyOpportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            websiteUrl: true,
            industry: true,
            district: true,
            verificationStatus: true,
          },
        },
      },
    });

    const formatted = items.map((item) => {
      let parsedTech: string[] = [];
      try {
        parsedTech = JSON.parse(item.technologies);
      } catch {
        parsedTech = [];
      }

      const isExpired = item.deadline ? new Date(item.deadline) < new Date() : false;

      return {
        id: item.id,
        title: item.title,
        type: item.type,
        location: item.location,
        technologies: parsedTech,
        link: item.link,
        deadline: item.deadline ? item.deadline.toISOString() : null,
        isExpired,
        company: item.company,
        createdAt: item.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
