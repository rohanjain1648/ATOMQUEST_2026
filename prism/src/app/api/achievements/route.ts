import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST: Save/update achievements for a goal sheet
export async function POST(request: Request) {
  const body = await request.json();
  const { achievements } = body; // [{ goalId, quarter, actual, status }]

  for (const ach of achievements) {
    // Compute score
    const goal = await prisma.goal.findUnique({ where: { id: ach.goalId } });
    if (!goal) continue;

    let score = 0;
    switch (goal.uom) {
      case 'MIN_NUMERIC':
      case 'MIN_PERCENT':
        score = goal.target === 0 ? 0 : Math.min((ach.actual / goal.target) * 100, 100);
        break;
      case 'MAX_NUMERIC':
      case 'MAX_PERCENT':
        score = ach.actual === 0 ? 100 : Math.min((goal.target / ach.actual) * 100, 100);
        break;
      case 'TIMELINE':
        score = ach.actual <= goal.target ? 100 : Math.max(0, 100 - ((ach.actual - goal.target) / goal.target) * 100);
        break;
      case 'ZERO':
        score = ach.actual === 0 ? 100 : 0;
        break;
    }

    // Upsert achievement
    const existing = await prisma.achievement.findFirst({
      where: { goalId: ach.goalId, quarter: ach.quarter },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: { actual: ach.actual, status: ach.status, score },
      });
    } else {
      await prisma.achievement.create({
        data: { goalId: ach.goalId, quarter: ach.quarter, actual: ach.actual, status: ach.status, score },
      });
    }
  }

  return NextResponse.json({ success: true });
}
