'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Users, Settings, LogOut, Bell, BarChart2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <div className="ambient-bg"></div>
      <div className="grid-overlay"></div>

      {/* Floating Sidebar */}
      <aside className="glass-panel" style={{ 
        width: '260px', 
        margin: 'var(--space-md)', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg) var(--space-md)'
      }}>
        <div style={{ padding: '0 var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>PRISM</h2>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Employee Portal</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
          <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/goals" className={`nav-item ${pathname === '/goals' ? 'active' : ''}`}>
            <Target size={18} />
            My Goals
          </Link>
          <Link href="/team" className={`nav-item ${pathname === '/team' ? 'active' : ''}`}>
            <Users size={18} />
            My Team
          </Link>
          <Link href="/analytics" className={`nav-item ${pathname === '/analytics' ? 'active' : ''}`}>
            <BarChart2 size={18} />
            Analytics & Governance
          </Link>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
              <Settings size={18} />
              Settings
            </Link>
            <Link href="/" className="nav-item text-danger">
              <LogOut size={18} />
              Sign Out
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-md) var(--space-md) var(--space-md) 0' }}>
        
        {/* Top Navbar */}
        <header className="glass-panel" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          padding: 'var(--space-sm) var(--space-lg)',
          marginBottom: 'var(--space-md)',
          borderRadius: 'var(--radius-lg)',
          position: 'relative'
        }}>
          <div className="flex items-center gap-md">
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            
            {showNotifications && (
              <div className="glass-panel" style={{ 
                position: 'absolute', 
                top: '70px', 
                right: 'var(--space-lg)', 
                width: '320px', 
                zIndex: 100,
                padding: 'var(--space-md)'
              }}>
                <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '1rem' }}>Recent Notifications</h4>
                <div className="flex flex-col gap-sm">
                  <div className="glass-card" style={{ padding: '10px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 600 }}>Goal Sheet Approved</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>Your Q1 goal sheet has been locked by Rohan Jain.</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '4px', color: 'var(--accent-info)' }}>2 hours ago</div>
                  </div>
                  <div className="glass-card" style={{ padding: '10px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 600 }}>Check-in Reminder</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>Please complete your monthly goal check-in.</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '4px', color: 'var(--accent-info)' }}>1 day ago</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }}></div>
            <div className="flex items-center gap-sm">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rohan Jain</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-info)' }}>Senior Developer</div>
              </div>
              <div className="avatar">RJ</div>
            </div>
          </div>
        </header>

        {/* Page Content (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
