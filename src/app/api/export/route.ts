export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Export Achievement Report as CSV
// BRD Section 4: "Achievement Report: Exportable (CSV / Excel) showing Planned Target vs. Actual Achievement for all employees"
export async function GET() {
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      goalSheets: {
        include: {
          goals: { include: { achievements: true } },
          cycle: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      manager: true,
    },
  });

  // CSV Header
  const headers = [
    'Employee Name',
    'Email',
    'Department',
    'Manager',
    'Cycle',
    'Goal Sheet Status',
    'Goal Title',
    'Thrust Area',
    'UoM',
    'Planned Target',
    'Weightage (%)',
    'Q1 Actual',
    'Q1 Score',
    'Q1 Status',
  ];

  const rows: string[][] = [];

  for (const emp of employees) {
    const sheet = emp.goalSheets[0];
    if (!sheet) {
      rows.push([
        emp.name,
        emp.email,
        emp.department,
        emp.manager?.name || 'N/A',
        'N/A',
        'NO SHEET',
        '', '', '', '', '', '', '', '',
      ]);
      continue;
    }

    for (const goal of sheet.goals) {
      const ach = goal.achievements.find(a => a.quarter === 'Q1');
      rows.push([
        emp.name,
        emp.email,
        emp.department,
        emp.manager?.name || 'N/A',
        sheet.cycle?.name || 'N/A',
        sheet.status,
        goal.title,
        goal.thrustArea,
        goal.uom,
        String(goal.target),
        String(goal.weightage),
        ach ? String(ach.actual) : '',
        ach?.score ? String(Math.round(ach.score * 100) / 100) : '',
        ach?.status || 'NOT_STARTED',
      ]);
    }
  }

  // Build CSV string with proper escaping
  const escapeCSV = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');

  // Return as downloadable CSV
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="PRISM_Achievement_Report_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
