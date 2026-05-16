import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  // Fetch users (Employees)
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      goalSheets: {
        include: {
          goals: { include: { achievements: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  const totalEmployees = employees.length;
  let lockedSheets = 0;
  let totalScoreSum = 0;
  let employeesWithScores = 0;

  const departmentMap = new Map<string, { totalScore: number; count: number }>();
  const statusDistribution = { COMPLETED: 0, ON_TRACK: 0, NOT_STARTED: 0 };
  const thrustAttainmentMap = new Map<string, { actual: number; target: number; count: number }>();

  // 1. Calculate KPIs, Department Scores, and Distribution
  employees.forEach(emp => {
    const sheet = emp.goalSheets[0];
    if (sheet?.status === 'LOCKED') lockedSheets++;

    let empScore = 0;
    if (sheet) {
      for (const goal of sheet.goals) {
        // Track Thrust Attainment for Radar Chart
        if (!thrustAttainmentMap.has(goal.thrustArea)) {
          thrustAttainmentMap.set(goal.thrustArea, { actual: 0, target: 100, count: 0 });
        }
        const thrustData = thrustAttainmentMap.get(goal.thrustArea)!;
        thrustData.count++;

        const ach = goal.achievements.find(a => a.quarter === 'Q1');
        if (ach) {
          if (ach.status === 'COMPLETED') statusDistribution.COMPLETED++;
          else if (ach.status === 'ON_TRACK') statusDistribution.ON_TRACK++;
          else statusDistribution.NOT_STARTED++;

          if (ach.score) {
            empScore += (ach.score * goal.weightage) / 100;
            thrustData.actual += ach.score;
          }
        } else {
          statusDistribution.NOT_STARTED++;
        }
      }
    }

    if (empScore > 0) {
      totalScoreSum += empScore;
      employeesWithScores++;
    }

    // Department grouping
    const dep = emp.department || 'Unknown';
    if (!departmentMap.has(dep)) departmentMap.set(dep, { totalScore: 0, count: 0 });
    const depData = departmentMap.get(dep)!;
    depData.totalScore += empScore;
    depData.count++;
  });

  const overallAttainment = employeesWithScores > 0 ? (totalScoreSum / employeesWithScores) : 0;
  
  const departmentScores = Array.from(departmentMap.entries()).map(([name, data]) => ({
    name,
    score: data.count > 0 ? Math.round(data.totalScore / data.count) : 0
  }));

  const thrustRadarData = Array.from(thrustAttainmentMap.entries()).map(([subject, data]) => ({
    subject,
    A: data.count > 0 ? Math.round(data.actual / data.count) : 0,
    fullMark: 100,
  }));

  // 2. Thrust Distribution
  const allGoals = await prisma.goal.findMany();
  const thrustMap = new Map<string, number>();
  let totalWeight = 0;
  allGoals.forEach(g => {
    const current = thrustMap.get(g.thrustArea) || 0;
    thrustMap.set(g.thrustArea, current + g.weightage);
    totalWeight += g.weightage;
  });

  const thrustColors: Record<string, string> = { Revenue: '#6366f1', Quality: '#06b6d4', Safety: '#10b981', People: '#a855f7', Cost: '#ec4899' };
  const thrustDistribution = Array.from(thrustMap.entries()).map(([name, weight]) => ({
    name,
    value: totalWeight > 0 ? Math.round((weight / totalWeight) * 100) : 0,
    color: thrustColors[name] || '#9ca3af'
  })).sort((a, b) => b.value - a.value);

  // 3. Check-ins
  const checkins = await prisma.checkIn.count({ where: { windowId: 'win-q1' } });
  const checkinsCompletedPercent = totalEmployees > 0 ? Math.round((checkins / totalEmployees) * 100) : 0;
  const pendingCheckins = totalEmployees - checkins;

  // 4. Escalations
  const escalations = [];
  const now = new Date();
  
  for (const emp of employees) {
    const sheet = emp.goalSheets[0];
    if (sheet?.status === 'SUBMITTED' && sheet.submittedAt) {
      const daysSinceSubmit = Math.floor((now.getTime() - sheet.submittedAt.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceSubmit > 3) {
        let level = 'L1';
        if (daysSinceSubmit > 14) level = 'L3';
        else if (daysSinceSubmit > 7) level = 'L2';
        
        escalations.push({
          id: sheet.id,
          level,
          employee: emp.name,
          manager: 'Rohan Jain',
          reason: 'Goal Sheet Pending Approval',
          status: 'Active',
          daysOverdue: daysSinceSubmit
        });
      }
    }
  }

  // 5. Audit Logs
  const auditLogsRaw = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const auditLogs = await Promise.all(auditLogsRaw.map(async (log) => {
    let userName = log.userId;
    if (log.userId === 'mgr-rohan') userName = 'Rohan Jain';
    const mins = Math.floor((now.getTime() - log.createdAt.getTime()) / 60000);
    const timeStr = mins < 60 ? `${mins} mins ago` : mins < 1440 ? `${Math.floor(mins/60)} hours ago` : `${Math.floor(mins/1440)} days ago`;
    
    return {
      id: log.id,
      action: log.action,
      user: userName,
      details: `${log.entityType} (${log.entityId})`,
      time: timeStr
    };
  }));

  const performanceTrend = [
    { month: 'Jul', score: 65, target: 70 },
    { month: 'Aug', score: 72, target: 75 },
    { month: 'Sep', score: 78, target: 80 },
    { month: 'Oct', score: 85, target: 85 },
    { month: 'Nov', score: 82, target: 88 },
    { month: 'Dec', score: Math.round(overallAttainment), target: 92 },
  ];

  // Manager Effectiveness Chart Data
  const managerEffectiveness = [
    { manager: 'Rohan J.', checkins: 100, approvals: 80 },
    { manager: 'Amit P.', checkins: 60, approvals: 90 },
    { manager: 'Priya S.', checkins: 85, approvals: 75 },
    { manager: 'Neha G.', checkins: 40, approvals: 50 },
  ];

  const data = {
    performanceTrend,
    thrustDistribution,
    departmentScores,
    thrustRadarData,
    statusDistribution: [
      { name: 'Completed', value: statusDistribution.COMPLETED, fill: '#10b981' },
      { name: 'On Track', value: statusDistribution.ON_TRACK, fill: '#6366f1' },
      { name: 'Not Started', value: statusDistribution.NOT_STARTED, fill: '#ef4444' },
    ],
    managerEffectiveness,
    escalations,
    auditLogs,
    kpis: {
      overallAttainment: overallAttainment.toFixed(1),
      goalsLockedPercent: totalEmployees > 0 ? Math.round((lockedSheets / totalEmployees) * 100) : 0,
      lockedSheets,
      totalEmployees,
      checkinsCompletedPercent,
      pendingCheckins,
      activeEscalations: escalations.length
    },
    rawEmployees: employees
  };

  return <AnalyticsClient data={data} />;
}
