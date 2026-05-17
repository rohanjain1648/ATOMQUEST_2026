export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch team members for a manager
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const managerId = searchParams.get('managerId') || 'mgr-rohan';

  const reports = await prisma.user.findMany({
    where: { managerId },
    include: {
      goalSheets: {
        include: {
          goals: { include: { achievements: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  // Check if check-in exists for each member
  const teamData = await Promise.all(
    reports.map(async (member) => {
      const checkin = await prisma.checkIn.findFirst({
        where: { employeeId: member.id, managerId },
      });

      const sheet = member.goalSheets[0];
      const goals = sheet?.goals || [];
      let weightedScore = 0;
      let goalsOnTrack = 0, goalsCompleted = 0, goalsNotStarted = 0;

      for (const goal of goals) {
        const latest = goal.achievements[goal.achievements.length - 1];
        if (latest) {
          weightedScore += ((latest.score ?? 0) * goal.weightage) / 100;
          if (latest.status === 'ON_TRACK') goalsOnTrack++;
          else if (latest.status === 'COMPLETED') goalsCompleted++;
          else goalsNotStarted++;
        } else {
          goalsNotStarted++;
        }
      }

      return {
        id: member.id,
        name: member.name,
        initials: member.name.split(' ').map(n => n[0]).join(''),
        role: member.department,
        department: member.department,
        goalCount: goals.length,
        sheetStatus: sheet?.status || 'DRAFT',
        weightedScore: Math.round(weightedScore * 10) / 10,
        checkinDone: !!checkin,
        goalsOnTrack,
        goalsCompleted,
        goalsNotStarted,
        sheetId: sheet?.id,
      };
    })
  );

  return NextResponse.json(teamData);
}
