import {prisma} from "../../lib/prisma"
import {NextRequest, NextResponse} from "next/server";

export async function POST(req:NextRequest){
    try {
        const body = await req.json();

        const {
            title,
            company,
            location,
            type,
            description,
            salary,
            postedById
        } = body;

        const response = await prisma.job.create({
            data:{
            title,
            company,
            location,
            type,
            description,
            salary,
            postedById
            }
        })

        return NextResponse.json(response, {status:201});
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            msg:"Error Creating Job"
        },
       {status:500}
    )
    }
}


export async function GET() {
  return NextResponse.json({
    message: "API is working",
  });
}