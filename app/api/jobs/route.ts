import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { company: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { type: { equals: type } } : {},
          location
            ? { location: { contains: location, mode: "insensitive" } }
            : {},
        ],
      },
      include: {
        postedBy: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { postedAt: "desc" },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error fetching jobs" }, { status: 500 });
  }
}
