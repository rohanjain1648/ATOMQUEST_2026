export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';

// POST: Manager approves/returns a goal sheet
export async function POST(request: Request) {
  const body = await request.json();
  const { sheetId, action, comment, managerId } = body;

  const mgrId = managerId || 'mgr-rohan';
  let newStatus = '';
  let updatedSheet;

  if (action === 'APPROVE') {
    newStatus = 'LOCKED';
    updatedSheet = await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: 'LOCKED', approvedAt: new Date(), lockedAt: new Date() },
      include: { user: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: mgrId,
        entityType: 'GoalSheet',
        entityId: sheetId,
        action: 'APPROVE',
        after: JSON.stringify({ status: 'LOCKED' }),
      },
    });
  } else if (action === 'RETURN') {
    newStatus = 'DRAFT';
    updatedSheet = await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: 'DRAFT', submittedAt: null },
      include: { user: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: mgrId,
        entityType: 'GoalSheet',
        entityId: sheetId,
        action: 'RETURN',
        after: JSON.stringify({ status: 'DRAFT', comment }),
      },
    });
  }

  // --- 5.2 Email & MS Teams Integration Trigger ---
  if (updatedSheet?.user) {
    const verb = action === 'APPROVE' ? 'approved' : 'returned for revisions';
    const emp = updatedSheet.user;
    
    // Email to Employee
    await NotificationService.sendEmail({
      to: emp.email,
      subject: `Your Goal Sheet was ${verb}`,
      body: `Hello ${emp.name},\n\nYour manager has ${verb} your goal sheet for the current cycle.${comment ? `\n\nComments: ${comment}` : ''}`,
      actionUrl: `https://prism-portal.company.com/goals`
    });

    // Teams Notification to Manager Team Channel
    await NotificationService.sendTeamsNotification(process.env.TEAMS_WEBHOOK_URL || '', {
      title: `Goal Sheet ${action === 'APPROVE' ? 'Approved' : 'Returned'}`,
      text: `The goal sheet for **${emp.name}** was ${verb} by their manager.`,
      actionUrl: `https://prism-portal.company.com/team/${emp.id}`
    });
  }

  return NextResponse.json({ success: true, sheet: updatedSheet });
}
