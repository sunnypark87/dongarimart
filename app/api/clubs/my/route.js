import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../prisma/prisma";
import "dotenv/config";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }

  const result = await client.ClubList.findMany({
    where: {
      members: {
        some: {
          userId: session.userId,
        }
      },
    },
    select: {
      id: true,
      clubName: true,
      classification: true,
      isRecruiting: true,
      oneLine: true,
      short: true,
      pageURL: true,
      tags: {
        select: {
          tagList: true,
        },
      },
      members: {
        where: {
          userId: session.userId,
        },
        select: {
          isLeader: true,
        }
      }
    },
  });

  const body = [];

  result.map((club) => {
    club.isLeader = club.members[0].isLeader;
    delete club.members;
    body.push(club);
  });

  console.log('clublist:', body);

  return NextResponse.json(body);
}