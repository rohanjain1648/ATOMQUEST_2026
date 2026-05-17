import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';

// GET: Fetch current user's goal sheet with goals and achievements
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'mgr-rohan';

  const sheet = await prisma.goalSheet.findFirst({
    where: { userId },
    include: {
      goals: { include: { achievements: true }, orderBy: { createdAt: 'asc' } },
      cycle: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(sheet);
}

// POST: Create a new goal sheet with goals
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, cycleId, goals } = body;

  // Validate total weightage
  const totalWeight = goals.reduce((s: number, g: any) => s + g.weightage, 0);
  if (totalWeight !== 100) {
    return NextResponse.json({ error: 'Total weightage must equal 100%' }, { status: 400 });
  }
  if (goals.length > 8) {
    return NextResponse.json({ error: 'Maximum 8 goals allowed' }, { status: 400 });
  }
  if (goals.some((g: any) => g.weightage < 10)) {
    return NextResponse.json({ error: 'Each goal must have minimum 10% weightage' }, { status: 400 });
  }

  const sheet = await prisma.goalSheet.create({
    data: {
      userId,
      cycleId,
      status: 'SUBMITTED',
      submittedAt: new Date(),
      goals: {
        create: goals.map((g: any) => ({
          thrustArea: g.thrustArea,
          title: g.title,
          uom: g.uom,
          target: g.target,
          weightage: g.weightage,
        })),
      },
    },
    include: { goals: true },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId,
      entityType: 'GoalSheet',
      entityId: sheet.id,
      action: 'SUBMIT',
      after: JSON.stringify({ status: 'SUBMITTED', goalCount: goals.length }),
    },
  });

  // --- 5.2 Notification Trigger ---
  const emp = await prisma.user.findUnique({ where: { id: userId }, include: { manager: true } });
  
  if (emp && emp.manager) {
    // Notify Manager via Email
    await NotificationService.sendEmail({
      to: emp.manager.email,
      subject: `Goal Sheet Submitted by ${emp.name}`,
      body: `${emp.name} has submitted their goal sheet for your review. Please log in to the portal to approve or return.`,
      actionUrl: `https://prism-portal.company.com/team/${emp.id}`
    });

    // Notify Manager via Teams
    await NotificationService.sendTeamsNotification(process.env.TEAMS_WEBHOOK_URL || '', {
      title: 'New Goal Sheet Submitted',
      text: `**${emp.name}** has submitted ${goals.length} goals for approval.`,
      actionUrl: `https://prism-portal.company.com/team/${emp.id}`
    });
  }

  return NextResponse.json(sheet, { status: 201 });
}
