import { NextRequest, NextResponse } from "next/server";
import { HackathonService } from "@/lib/services/hackathon.service";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError, AppError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const hackathon = await HackathonService.getBySlugOrId(id);

    return NextResponse.json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const { id } = params;
    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { organizerProfile: true },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    if (user.role !== "ADMIN" && hackathon.organizerProfile?.userId !== user.userId) {
      throw AppError.forbidden("You do not have permission to edit this hackathon.");
    }

    const body = await req.json();
    const updated = await prisma.hackathon.update({
      where: { id: hackathon.id },
      data: {
        title: body.title !== undefined ? body.title : hackathon.title,
        tagline: body.tagline !== undefined ? body.tagline : hackathon.tagline,
        description: body.description !== undefined ? body.description : hackathon.description,
        district: body.district !== undefined ? body.district : hackathon.district,
        city: body.city !== undefined ? body.city : hackathon.city,
        address: body.address !== undefined ? body.address : hackathon.address,
        format: body.format !== undefined ? body.format : hackathon.format,
        eligibility: body.eligibility !== undefined ? body.eligibility : hackathon.eligibility,
        minTeamSize: body.minTeamSize !== undefined ? body.minTeamSize : hackathon.minTeamSize,
        maxTeamSize: body.maxTeamSize !== undefined ? body.maxTeamSize : hackathon.maxTeamSize,
        technologies: body.technologies ? JSON.stringify(body.technologies) : hackathon.technologies,
        theme: body.theme ? JSON.stringify(body.theme) : hackathon.theme,
        rules: body.rules ? JSON.stringify(body.rules) : hackathon.rules,
        featured: body.featured !== undefined ? body.featured : hackathon.featured,
      },
    });

    return NextResponse.json({
      success: true,
      data: await HackathonService.getBySlugOrId(updated.id),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
