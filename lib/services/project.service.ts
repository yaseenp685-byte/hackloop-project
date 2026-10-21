import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { CreateProjectDto } from "@/lib/validation/project.schema";

export interface ProjectListParams {
  search?: string;
  category?: string;
  sort?: "recent" | "likes" | "views";
  page?: number;
  limit?: number;
}

export class ProjectService {
  static async list(params: ProjectListParams, currentUserId?: string) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.category && params.category !== "ALL") {
      where.category = params.category;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q } },
        { tagline: { contains: q } },
        { description: { contains: q } },
        { technologies: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "likes") {
      orderBy = { likesCount: "desc" };
    } else if (params.sort === "views") {
      orderBy = { viewsCount: "desc" };
    }

    const [total, items] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              studentProfile: {
                select: {
                  collegeName: true,
                  usnOrRollNo: true,
                  githubUrl: true,
                  district: true,
                },
              },
            },
          },
          likes: currentUserId
            ? {
                where: { userId: currentUserId },
                select: { id: true },
              }
            : false,
          bookmarks: currentUserId
            ? {
                where: { userId: currentUserId },
                select: { id: true },
              }
            : false,
        },
      }),
    ]);

    const formatted = items.map((item) => {
      let parsedTech: string[] = [];
      try {
        parsedTech = JSON.parse(item.technologies);
      } catch {
        parsedTech = [];
      }

      return {
        id: item.id,
        title: item.title,
        tagline: item.tagline,
        description: item.description,
        category: item.category,
        technologies: parsedTech,
        repoUrl: item.repoUrl,
        demoUrl: item.demoUrl,
        imageUrl: item.imageUrl,
        author: {
          id: item.author.id,
          name: item.author.name,
          college: item.author.studentProfile?.collegeName || "Karnataka Tech Institute",
          githubUrl: item.author.studentProfile?.githubUrl || null,
        },
        likesCount: item.likesCount,
        viewsCount: item.viewsCount,
        featured: item.featured,
        isLiked: currentUserId ? (item.likes as any[]).length > 0 : false,
        isBookmarked: currentUserId ? (item.bookmarks as any[]).length > 0 : false,
        createdAt: item.createdAt.toISOString(),
      };
    });

    return {
      items: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string, currentUserId?: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: {
              select: {
                collegeName: true,
                usnOrRollNo: true,
                district: true,
                degreeBranch: true,
                graduationYear: true,
                bio: true,
                githubUrl: true,
                linkedinUrl: true,
                portfolioUrl: true,
                skills: true,
                technologies: true,
              },
            },
          },
        },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
        bookmarks: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!project) {
      throw AppError.notFound("Project not found");
    }

    // Increment view count asynchronously
    await prisma.project.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    let parsedTech: string[] = [];
    try {
      parsedTech = JSON.parse(project.technologies);
    } catch {
      parsedTech = [];
    }

    return {
      id: project.id,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      category: project.category,
      technologies: parsedTech,
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      imageUrl: project.imageUrl,
      author: {
        id: project.author.id,
        name: project.author.name,
        college: project.author.studentProfile?.collegeName || "Karnataka Tech Institute",
        degreeBranch: project.author.studentProfile?.degreeBranch || null,
        bio: project.author.studentProfile?.bio || null,
        githubUrl: project.author.studentProfile?.githubUrl || null,
        linkedinUrl: project.author.studentProfile?.linkedinUrl || null,
        portfolioUrl: project.author.studentProfile?.portfolioUrl || null,
      },
      likesCount: project.likesCount,
      viewsCount: project.viewsCount + 1,
      featured: project.featured,
      isLiked: currentUserId ? (project.likes as any[]).length > 0 : false,
      isBookmarked: currentUserId ? (project.bookmarks as any[]).length > 0 : false,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  static async create(userId: string, data: CreateProjectDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw AppError.unauthorized("User not found");
    }

    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        tagline: data.tagline.trim(),
        description: data.description.trim(),
        category: data.category,
        technologies: JSON.stringify(data.technologies),
        repoUrl: data.repoUrl || null,
        demoUrl: data.demoUrl || null,
        imageUrl: data.imageUrl || null,
        authorId: userId,
      },
    });

    return project;
  }

  static async toggleLike(projectId: string, userId: string) {
    const existing = await prisma.projectLike.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.projectLike.delete({ where: { id: existing.id } }),
        prisma.project.update({
          where: { id: projectId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    } else {
      await prisma.$transaction([
        prisma.projectLike.create({
          data: { projectId, userId },
        }),
        prisma.project.update({
          where: { id: projectId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
      return { liked: true };
    }
  }

  static async toggleBookmark(projectId: string, userId: string) {
    const existing = await prisma.projectBookmark.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existing) {
      await prisma.projectBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    } else {
      await prisma.projectBookmark.create({
        data: { projectId, userId },
      });
      return { bookmarked: true };
    }
  }

  static async getFeatured() {
    const featured = await prisma.project.findFirst({
      where: { featured: true },
      orderBy: { likesCount: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            studentProfile: {
              select: {
                collegeName: true,
                usnOrRollNo: true,
                githubUrl: true,
              },
            },
          },
        },
      },
    });

    if (!featured) return null;

    let parsedTech: string[] = [];
    try {
      parsedTech = JSON.parse(featured.technologies);
    } catch {
      parsedTech = [];
    }

    return {
      id: featured.id,
      title: featured.title,
      tagline: featured.tagline,
      description: featured.description,
      category: featured.category,
      technologies: parsedTech,
      repoUrl: featured.repoUrl,
      demoUrl: featured.demoUrl,
      imageUrl: featured.imageUrl,
      author: {
        id: featured.author.id,
        name: featured.author.name,
        college: featured.author.studentProfile?.collegeName || "Karnataka Tech Institute",
      },
      likesCount: featured.likesCount,
      viewsCount: featured.viewsCount,
      createdAt: featured.createdAt.toISOString(),
    };
  }
}
