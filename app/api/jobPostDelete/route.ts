import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json({ msg: "Job ID required" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return NextResponse.json({ msg: "Job not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user || job.postedById !== user.id) {
      return NextResponse.json({ msg: "Forbidden" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id: jobId } });

    return NextResponse.json({ msg: "Job deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error deleting job" }, { status: 500 });
  }
}
