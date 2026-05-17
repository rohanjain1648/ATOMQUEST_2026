export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';

// POST: Submit a check-in comment
export async function POST(request: Request) {
  const body = await request.json();
  const { managerId, employeeId, comment, windowId } = body;

  const checkin = await prisma.checkIn.create({
    data: {
      managerId: managerId || 'mgr-rohan',
      employeeId,
      comment,
      windowId: windowId || 'win-q1',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: managerId || 'mgr-rohan',
      entityType: 'CheckIn',
      entityId: checkin.id,
      action: 'CHECKIN_SUBMIT',
      after: JSON.stringify({ employeeId, comment: comment.substring(0, 100) }),
    },
  });

  // --- 5.2 Notification Trigger ---
  const emp = await prisma.user.findUnique({ where: { id: employeeId } });
  
  if (emp) {
    // Notify Employee via Email
    await NotificationService.sendEmail({
      to: emp.email,
      subject: `Quarterly Check-in Completed`,
      body: `Hello ${emp.name},\n\nYour manager has completed your quarterly check-in.\n\nManager Comments: ${comment}`,
      actionUrl: `https://prism-portal.company.com/goals`
    });

    // Notify Manager via Teams (for tracking)
    await NotificationService.sendTeamsNotification(process.env.TEAMS_WEBHOOK_URL || '', {
      title: 'Check-in Completed',
      text: `You have successfully completed the check-in for **${emp.name}**.`,
      actionUrl: `https://prism-portal.company.com/team`
    });
  }

  return NextResponse.json(checkin, { status: 201 });
}
