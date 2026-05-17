import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding PRISM database...');

  await prisma.auditLog.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.goalSheet.deleteMany();
  await prisma.checkInWindow.deleteMany();
  await prisma.goalCycle.deleteMany();
  await prisma.escalationLog.deleteMany();
  await prisma.escalationRule.deleteMany();
  await prisma.user.deleteMany();

  const manager = await prisma.user.create({ data: { id: 'mgr-rohan', email: 'rohan.jain@company.com', name: 'Rohan Jain', role: 'MANAGER', department: 'Engineering' } });
  await prisma.user.create({ data: { id: 'emp-priya', email: 'priya.sharma@company.com', name: 'Priya Sharma', role: 'EMPLOYEE', department: 'Engineering', managerId: manager.id } });
  await prisma.user.create({ data: { id: 'emp-amit', email: 'amit.patel@company.com', name: 'Amit Patel', role: 'EMPLOYEE', department: 'Engineering', managerId: manager.id } });
  await prisma.user.create({ data: { id: 'emp-neha', email: 'neha.gupta@company.com', name: 'Neha Gupta', role: 'EMPLOYEE', department: 'Engineering', managerId: manager.id } });
  await prisma.user.create({ data: { id: 'emp-ravi', email: 'ravi.kumar@company.com', name: 'Ravi Kumar', role: 'EMPLOYEE', department: 'Engineering', managerId: manager.id } });

  const cycle = await prisma.goalCycle.create({ data: { id: 'cycle-fy2627', name: 'FY 2026-27', startDate: new Date('2026-04-01'), endDate: new Date('2027-03-31'), status: 'ACTIVE' } });
  await prisma.checkInWindow.create({ data: { id: 'win-q1', cycleId: cycle.id, quarter: 'Q1', opensAt: new Date('2026-07-01'), closesAt: new Date('2026-07-31') } });

  // Priya - LOCKED with Q1 achievements
  await prisma.goalSheet.create({ data: { id: 'sheet-priya', userId: 'emp-priya', cycleId: cycle.id, status: 'LOCKED', submittedAt: new Date('2026-04-15'), approvedAt: new Date('2026-04-18'), lockedAt: new Date('2026-04-18') } });
  for (const g of [
    { id: 'g-p1', thrustArea: 'Revenue', title: 'Achieve quarterly sales target of 50L', uom: 'MIN_NUMERIC', target: 50, weightage: 30 },
    { id: 'g-p2', thrustArea: 'Quality', title: 'Reduce bug count per release to < 5', uom: 'MAX_NUMERIC', target: 5, weightage: 25 },
    { id: 'g-p3', thrustArea: 'People', title: 'Mentor 2 junior developers', uom: 'MIN_NUMERIC', target: 2, weightage: 15 },
    { id: 'g-p4', thrustArea: 'Safety', title: 'Zero data breach incidents', uom: 'ZERO', target: 0, weightage: 20 },
    { id: 'g-p5', thrustArea: 'Cost', title: 'Optimize CI/CD pipeline costs by 15%', uom: 'MIN_PERCENT', target: 15, weightage: 10 },
  ]) { await prisma.goal.create({ data: { ...g, goalSheetId: 'sheet-priya' } }); }
  for (const a of [
    { goalId: 'g-p1', actual: 38, status: 'ON_TRACK', score: 76 },
    { goalId: 'g-p2', actual: 4, status: 'ON_TRACK', score: 100 },
    { goalId: 'g-p3', actual: 1, status: 'ON_TRACK', score: 50 },
    { goalId: 'g-p4', actual: 0, status: 'COMPLETED', score: 100 },
    { goalId: 'g-p5', actual: 5, status: 'NOT_STARTED', score: 33 },
  ]) { await prisma.achievement.create({ data: { ...a, quarter: 'Q1' } }); }

  // Amit - LOCKED with Q1 achievements + check-in done
  await prisma.goalSheet.create({ data: { id: 'sheet-amit', userId: 'emp-amit', cycleId: cycle.id, status: 'LOCKED', submittedAt: new Date('2026-04-12'), approvedAt: new Date('2026-04-14'), lockedAt: new Date('2026-04-14') } });
  for (const g of [
    { id: 'g-a1', thrustArea: 'Revenue', title: 'Increase API throughput by 20%', uom: 'MIN_PERCENT', target: 20, weightage: 25 },
    { id: 'g-a2', thrustArea: 'Quality', title: 'Achieve 95% test coverage', uom: 'MIN_PERCENT', target: 95, weightage: 25 },
    { id: 'g-a3', thrustArea: 'Cost', title: 'Reduce cloud infra costs by 12%', uom: 'MIN_PERCENT', target: 12, weightage: 20 },
    { id: 'g-a4', thrustArea: 'People', title: 'Conduct 4 knowledge-sharing sessions', uom: 'MIN_NUMERIC', target: 4, weightage: 15 },
    { id: 'g-a5', thrustArea: 'Safety', title: 'Zero production outages', uom: 'ZERO', target: 0, weightage: 15 },
  ]) { await prisma.goal.create({ data: { ...g, goalSheetId: 'sheet-amit' } }); }
  for (const a of [
    { goalId: 'g-a1', actual: 18, status: 'ON_TRACK', score: 90 },
    { goalId: 'g-a2', actual: 88, status: 'ON_TRACK', score: 92.6 },
    { goalId: 'g-a3', actual: 10, status: 'ON_TRACK', score: 83.3 },
    { goalId: 'g-a4', actual: 3, status: 'ON_TRACK', score: 75 },
    { goalId: 'g-a5', actual: 0, status: 'COMPLETED', score: 100 },
  ]) { await prisma.achievement.create({ data: { ...a, quarter: 'Q1' } }); }
  await prisma.checkIn.create({ data: { windowId: 'win-q1', managerId: manager.id, employeeId: 'emp-amit', comment: 'Excellent progress across all goals.' } });

  // Neha - SUBMITTED (pending review)
  await prisma.goalSheet.create({ data: { id: 'sheet-neha', userId: 'emp-neha', cycleId: cycle.id, status: 'SUBMITTED', submittedAt: new Date('2026-05-10') } });
  for (const g of [
    { id: 'g-n1', thrustArea: 'Quality', title: 'Implement automated regression suite', uom: 'MIN_PERCENT', target: 100, weightage: 35 },
    { id: 'g-n2', thrustArea: 'Revenue', title: 'Reduce QA cycle time by 30%', uom: 'MIN_PERCENT', target: 30, weightage: 25 },
    { id: 'g-n3', thrustArea: 'People', title: 'Train 3 manual testers on automation', uom: 'MIN_NUMERIC', target: 3, weightage: 20 },
    { id: 'g-n4', thrustArea: 'Safety', title: 'Zero critical bugs in production', uom: 'ZERO', target: 0, weightage: 20 },
  ]) { await prisma.goal.create({ data: { ...g, goalSheetId: 'sheet-neha' } }); }

  // Ravi - LOCKED, no achievements
  await prisma.goalSheet.create({ data: { id: 'sheet-ravi', userId: 'emp-ravi', cycleId: cycle.id, status: 'LOCKED', submittedAt: new Date('2026-04-20'), approvedAt: new Date('2026-04-22'), lockedAt: new Date('2026-04-22') } });
  for (const g of [
    { id: 'g-r1', thrustArea: 'Safety', title: '99.9% uptime SLA compliance', uom: 'MIN_PERCENT', target: 99.9, weightage: 30 },
    { id: 'g-r2', thrustArea: 'Cost', title: 'Optimize container resource usage by 20%', uom: 'MIN_PERCENT', target: 20, weightage: 25 },
    { id: 'g-r3', thrustArea: 'Quality', title: 'Implement blue-green deployments', uom: 'TIMELINE', target: 100, weightage: 25 },
    { id: 'g-r4', thrustArea: 'People', title: 'Document all runbooks', uom: 'MIN_NUMERIC', target: 10, weightage: 20 },
  ]) { await prisma.goal.create({ data: { ...g, goalSheetId: 'sheet-ravi' } }); }

  await prisma.auditLog.createMany({ data: [
    { userId: manager.id, entityType: 'GoalSheet', entityId: 'sheet-priya', action: 'APPROVE', after: '{"status":"LOCKED"}' },
    { userId: manager.id, entityType: 'GoalSheet', entityId: 'sheet-amit', action: 'APPROVE', after: '{"status":"LOCKED"}' },
  ]});
  await prisma.escalationRule.createMany({ data: [
    { triggerEvent: 'GOAL_SHEET_PENDING', daysThreshold: 3, escalateTo: 'EMPLOYEE' },
    { triggerEvent: 'GOAL_SHEET_PENDING', daysThreshold: 7, escalateTo: 'MANAGER' },
    { triggerEvent: 'GOAL_SHEET_PENDING', daysThreshold: 14, escalateTo: 'HR' },
  ]});

  console.log('✅ Seed complete!');
  console.log(`   👤 Users: ${await prisma.user.count()}`);
  console.log(`   📋 Goal Sheets: ${await prisma.goalSheet.count()}`);
  console.log(`   🎯 Goals: ${await prisma.goal.count()}`);
  console.log(`   📊 Achievements: ${await prisma.achievement.count()}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
