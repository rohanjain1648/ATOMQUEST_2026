
import { prisma } from '@/lib/prisma';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const managerId = 'mgr-rohan';

  const reports = await prisma.user.findMany({
    where: { managerId },
    include: {
      goalSheets: {
        include: { goals: { include: { achievements: true } } },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  // Check check-in status for each report
  const teamData = await Promise.all(
    reports.map(async (member) => {
      const checkin = await prisma.checkIn.findFirst({
        where: { employeeId: member.id, managerId },
      });
      const sheet = member.goalSheets[0];
      const goals = sheet?.goals || [];
      let weightedScore = 0;
      let onTrack = 0, completed = 0, notStarted = 0;
      for (const goal of goals) {
        const ach = goal.achievements.find(a => a.quarter === 'Q1');
        if (ach?.score) { weightedScore += (ach.score * goal.weightage) / 100; }
        if (ach?.status === 'ON_TRACK') onTrack++;
        else if (ach?.status === 'COMPLETED') completed++;
        else notStarted++;
      }
      return {
        id: member.id,
        name: member.name,
        department: member.department,
        goals,
        sheet: sheet ? { status: sheet.status, approvedAt: sheet.approvedAt } : null,
        weightedScore,
        checkinDone: !!checkin,
        onTrack,
        completed,
        notStarted,
      };
    })
  );

  return <TeamClient teamData={teamData} />;
}
