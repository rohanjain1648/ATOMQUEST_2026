
import Link from 'next/link';
import { Target, TrendingUp, AlertCircle, Clock, CalendarClock, Users, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const cookieStore = cookies();
  const userId = cookieStore.get('prism_user_id')?.value || 'emp-priya';
  const isManager = userId === 'mgr-rohan';

  // Fetch active user details
  const activeUser = await prisma.user.findUnique({ where: { id: userId } });

  // Fetch active goal cycle
  const cycle = await prisma.goalCycle.findFirst({ where: { status: 'ACTIVE' }, include: { checkInWindows: true } });

  // Fetch real sheet data
  const sheet = await prisma.goalSheet.findFirst({
    where: { userId },
    include: { goals: { include: { achievements: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch manager stats if applicable
  const pendingApprovals = isManager ? await prisma.goalSheet.count({ where: { status: 'SUBMITTED' } }) : 0;
  const teamCount = isManager ? await prisma.user.count({ where: { managerId: userId } }) : 0;

  // Compute weighted score
  let weightedScore = 0;
  const goals = sheet?.goals || [];
  for (const goal of goals) {
    const ach = goal.achievements.find(a => a.quarter === 'Q1');
    if (ach?.score) weightedScore += (ach.score * goal.weightage) / 100;
  }

  // Determine current check-in window status
  const now = new Date();
  const windows = cycle?.checkInWindows || [];
  let activeWindow = null;
  let nextWindow = null;
  
  for (const win of windows) {
    if (now >= win.opensAt && now <= win.closesAt) {
      activeWindow = win;
    } else if (now < win.opensAt && (!nextWindow || win.opensAt < nextWindow.opensAt)) {
      nextWindow = win;
    }
  }

  const submissionDeadline = cycle ? new Date(cycle.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const daysUntilDeadline = submissionDeadline ? Math.max(0, Math.ceil((submissionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 14;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Welcome back, {activeUser?.name || 'User'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            {isManager 
              ? `Manage your team goals and track organizational alignment for ${cycle?.name || 'FY 2026-27'}.`
              : `Here is your performance overview for ${cycle?.name || 'FY 2026-27'}.`
            }
          </p>
        </div>
        {!isManager && (
          <Link href="/goals/create" className="btn btn-primary">
            + Create Goal Sheet
          </Link>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-3 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
        {isManager ? (
          <>
            <div className="glass-card">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Pending Approvals</div>
                <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', border: 'none' }}>
                  <AlertCircle size={16} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{pendingApprovals} Action Required</h2>
              <div className="flex items-center gap-xs" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                <Clock size={12} />
                Goal sheets waiting for L1 review
              </div>
            </div>

            <div className="glass-card">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Direct Reports</div>
                <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: 'none' }}>
                  <Users size={16} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{teamCount} Active</h2>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                Engineering department reports
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Goal Submission Status</div>
                <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', border: 'none' }}>
                  <AlertCircle size={16} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{sheet?.status === 'LOCKED' ? 'Locked ✓' : sheet?.status || 'Pending'}</h2>
              <div className="flex items-center gap-xs" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                <Clock size={12} />
                {sheet?.status === 'LOCKED' ? `Approved ${sheet.approvedAt ? new Date(sheet.approvedAt).toLocaleDateString() : ''}` : `Due in ${daysUntilDeadline} days`}
              </div>
            </div>

            <div className="glass-card">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Overall Progress</div>
                <div className="icon-btn" style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: 'none' }}>
                  <TrendingUp size={16} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{weightedScore.toFixed(0)}%</h2>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${Math.min(weightedScore, 100)}%` }}></div>
              </div>
            </div>
          </>
        )}

        <div className="glass-card" style={{ background: 'var(--gradient-primary)', borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Active Cycle</div>
            <Target size={16} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{cycle?.name || 'FY 26-27'}</h2>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
            Goal setting window closes May 30
          </div>
        </div>
      </div>

      {/* Check-in Window Status (BRD Section 2.3) */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarClock size={20} color="var(--accent-info)" /> Quarterly Check-in Schedule
        </h3>
        <div className="grid grid-cols-5 gap-sm">
          {[
            { quarter: 'Phase 1', label: 'Goal Setting', month: 'May', opens: '2026-05-01', closes: '2026-05-31' },
            { quarter: 'Q1', label: 'Progress Update', month: 'July', opens: '2026-07-01', closes: '2026-07-31' },
            { quarter: 'Q2', label: 'Progress Update', month: 'October', opens: '2026-10-01', closes: '2026-10-31' },
            { quarter: 'Q3', label: 'Progress Update', month: 'January', opens: '2027-01-01', closes: '2027-01-31' },
            { quarter: 'Q4', label: 'Final Capture', month: 'March', opens: '2027-03-01', closes: '2027-04-15' },
          ].map((win) => {
            const winOpens = new Date(win.opens);
            const winCloses = new Date(win.closes);
            const isActive = now >= winOpens && now <= winCloses;
            const isPast = now > winCloses;

            return (
              <div
                key={win.quarter}
                className="glass-card"
                style={{
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  border: isActive ? '1px solid var(--accent-success)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none',
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: isActive ? 'var(--accent-success)' : 'rgba(255,255,255,0.4)', marginBottom: '4px', fontWeight: 700 }}>
                  {isActive ? '● ACTIVE' : isPast ? '✓ DONE' : '○ UPCOMING'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '2px' }}>{win.quarter}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{win.label}</div>
                <div style={{ fontSize: '0.75rem', color: isActive ? 'var(--accent-info)' : 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
                  {win.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Required */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>Action Required</h3>
        {isManager ? (
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.05)', 
            border: '1px solid rgba(99, 102, 241, 0.1)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="flex items-center gap-md">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Neha Gupta submitted her Goal Sheet for review</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Review goals, assign weights, adjust targets, and locking for cycle.</div>
              </div>
            </div>
            <Link href="/team" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Review Sheet
            </Link>
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="flex items-center gap-md">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {sheet?.status === 'LOCKED' 
                    ? 'Goal setting cycle completed successfully' 
                    : `Submit your Goal Sheet for ${cycle?.name || 'FY 2026-27'}`
                  }
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  {sheet?.status === 'LOCKED'
                    ? 'Your goal cycle is locked and achievements are tracked automatically.'
                    : 'You must define and submit your goals for manager approval.'
                  }
                </div>
              </div>
            </div>
            {sheet?.status === 'LOCKED' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Locked
              </div>
            ) : (
              <Link href="/goals/create" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Start Now
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
