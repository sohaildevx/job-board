import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { title, company, location, type, description, salary, postedById } =
      body;

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    const response = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        description,
        salary,
        postedById:user.id,
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        msg: "Error Creating Job",
      },
      { status: 500 },
    );
  }
}
