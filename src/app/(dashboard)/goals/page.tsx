export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Target, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function GoalsPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('prism_user_id')?.value || 'emp-priya';

  // Fetch real data from database
  const sheet = await prisma.goalSheet.findFirst({
    where: { userId },
    include: {
      goals: { include: { achievements: true }, orderBy: { createdAt: 'asc' } },
      cycle: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const goals = sheet?.goals || [];
  const thrustColors: Record<string, string> = { Revenue: '#6366f1', Quality: '#06b6d4', Safety: '#10b981', People: '#a855f7', Cost: '#ec4899' };

  // Compute weighted score from real achievements
  let weightedScore = 0;
  for (const goal of goals) {
    const latest = goal.achievements.find(a => a.quarter === 'Q1');
    if (latest?.score) {
      weightedScore += (latest.score * goal.weightage) / 100;
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>My Goals</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
          {sheet?.cycle?.name || 'FY 2026-27'} • <span className="badge badge-locked">🔒 {sheet?.status}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Weighted Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">{weightedScore.toFixed(1)}%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Based on Q1 actuals</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Goals Defined</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{goals.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Max 8 allowed</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Current Quarter</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>Q1</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Window open: July</div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Goal Breakdown</h3>
          <Link href="/goals/track" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>📈 Log Q1 Achievement</Link>
        </div>

        <div className="flex flex-col gap-md">
          {goals.map((goal, i) => {
            const achievement = goal.achievements.find(a => a.quarter === 'Q1');
            const score = achievement?.score ?? 0;
            const status = achievement?.status ?? 'NOT_STARTED';
            return (
              <div key={goal.id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '4px 1fr auto', gap: 'var(--space-md)', alignItems: 'center', padding: '16px' }}>
                <div style={{ width: '4px', height: '100%', borderRadius: '2px', background: thrustColors[goal.thrustArea] || '#6366f1' }}></div>
                <div>
                  <div style={{ fontWeight: 600, color: thrustColors[goal.thrustArea] }}>{goal.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    {goal.thrustArea} • Target: {goal.target} • Weight: {goal.weightage}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{Math.round(score)}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Q1 Score</div>
                  <span className={`badge ${status === 'COMPLETED' ? 'badge-active' : status === 'ON_TRACK' ? 'badge-locked' : 'badge-draft'}`} style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                    {status === 'ON_TRACK' ? '↗ On Track' : status === 'COMPLETED' ? '✓ Completed' : '○ Not Started'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
