import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';

// POST: Push a shared goal to multiple employees
// BRD Section 2.1: "Admin or manager can push a departmental KPI to multiple employees"
export async function POST(request: Request) {
  const body = await request.json();
  const { managerId, employeeIds, thrustArea, title, uom, target, weightage } = body;

  const mgrId = managerId || 'mgr-rohan';

  // Validate
  if (!employeeIds || employeeIds.length === 0) {
    return NextResponse.json({ error: 'At least one employee must be selected' }, { status: 400 });
  }
  if (!title || !thrustArea || !uom || !target) {
    return NextResponse.json({ error: 'All goal fields are required' }, { status: 400 });
  }
  if (weightage < 10) {
    return NextResponse.json({ error: 'Minimum weightage is 10%' }, { status: 400 });
  }

  const results = [];

  for (const empId of employeeIds) {
    // Find or create a DRAFT goal sheet for this employee
    const cycle = await prisma.goalCycle.findFirst({ where: { status: 'ACTIVE' } });
    if (!cycle) {
      return NextResponse.json({ error: 'No active goal cycle found' }, { status: 400 });
    }

    let sheet = await prisma.goalSheet.findFirst({
      where: { userId: empId, cycleId: cycle.id },
      include: { goals: true },
    });

    // If sheet is LOCKED, skip this employee (can't modify locked sheets)
    if (sheet?.status === 'LOCKED') {
      results.push({ employeeId: empId, status: 'SKIPPED', reason: 'Goal sheet is locked' });
      continue;
    }

    // Check max 8 goals
    if (sheet && sheet.goals.length >= 8) {
      results.push({ employeeId: empId, status: 'SKIPPED', reason: 'Max 8 goals reached' });
      continue;
    }

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = await prisma.goalSheet.create({
        data: { userId: empId, cycleId: cycle.id, status: 'DRAFT' },
        include: { goals: true },
      });
    }

    // Create the shared goal
    const goal = await prisma.goal.create({
      data: {
        goalSheetId: sheet.id,
        thrustArea,
        title,
        uom,
        target,
        weightage,
        isShared: true,
      },
    });

    results.push({ employeeId: empId, status: 'ADDED', goalId: goal.id });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: mgrId,
        entityType: 'Goal',
        entityId: goal.id,
        action: 'SHARED_GOAL_PUSH',
        after: JSON.stringify({ title, thrustArea, target, weightage, sharedTo: empId }),
      },
    });

    // Notify employee
    const emp = await prisma.user.findUnique({ where: { id: empId } });
    if (emp) {
      await NotificationService.sendEmail({
        to: emp.email,
        subject: `New Shared Goal Assigned: ${title}`,
        body: `Hello ${emp.name},\n\nA departmental KPI has been assigned to you by your manager:\n\nGoal: ${title}\nThrust Area: ${thrustArea}\nTarget: ${target}\nWeightage: ${weightage}%\n\nPlease review and adjust your weightage distribution accordingly.`,
        actionUrl: `https://prism-portal.company.com/goals`,
      });
    }
  }

  return NextResponse.json({ success: true, results }, { status: 201 });
}
