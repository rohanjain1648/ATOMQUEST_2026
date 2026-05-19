'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Shield, Mail, MessageSquare, Save, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [teamsNotifs, setTeamsNotifs] = useState(true);
  const [sessionLocation, setSessionLocation] = useState('Detecting...');
  const [saved, setSaved] = useState(false);

  // Detect real location from IP geolocation
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          setSessionLocation(`${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`);
        } else {
          // Fallback via timezone heuristic
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setSessionLocation(tz.replace('_', ' ').split('/').pop() || 'Unknown');
        }
      } catch {
        // Fallback via timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setSessionLocation(tz.replace('_', ' ').split('/').pop() || 'Unknown');
      }
    };
    detectLocation();
  }, []);

  // Get active user info from cookie
  const [activeUser, setActiveUser] = useState({ name: 'Rohan Jain', email: 'rohan.jain@company.com', department: 'Engineering', title: 'Engineering Manager', initials: 'RJ' });
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )prism_user_id=([^;]*)/);
    const userId = match ? match[1] : 'mgr-rohan';
    if (userId === 'emp-priya') {
      setActiveUser({ name: 'Priya Sharma', email: 'priya.sharma@company.com', department: 'Engineering', title: 'Senior Developer', initials: 'PS' });
    } else if (userId === 'emp-neha') {
      setActiveUser({ name: 'Neha Gupta', email: 'neha.gupta@company.com', department: 'QA', title: 'Software Engineer', initials: 'NG' });
    } else if (userId === 'mgr-rohan') {
      setActiveUser({ name: 'Rohan Jain', email: 'rohan.jain@company.com', department: 'Engineering', title: 'Engineering Manager', initials: 'RJ' });
    } else if (userId === 'emp-amit') {
      setActiveUser({ name: 'Amit Patel', email: 'amit.patel@company.com', department: 'Engineering', title: 'Backend Developer', initials: 'AP' });
    } else if (userId === 'emp-ravi') {
      setActiveUser({ name: 'Ravi Kumar', email: 'ravi.kumar@company.com', department: 'Operations', title: 'DevOps Engineer', initials: 'RK' });
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Detect browser info
  const getBrowserInfo = () => {
    if (typeof navigator === 'undefined') return 'Unknown Browser';
    const ua = navigator.userAgent;
    let browser = 'Browser';
    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';

    let os = 'OS';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';

    return `${browser} on ${os}`;
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Manage your account preferences and integrations</p>
      </div>

      <div className="grid grid-cols-12 gap-lg">
        {/* Navigation Tabs */}
        <div className="col-span-12 lg-col-span-3">
          <div className="glass-panel" style={{ padding: 'var(--space-md)' }}>
            <div className="flex flex-col gap-xs">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                style={{ background: activeTab === 'profile' ? 'var(--gradient-primary)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <User size={18} /> Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                style={{ background: activeTab === 'notifications' ? 'var(--gradient-primary)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <Bell size={18} /> Notifications
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                style={{ background: activeTab === 'security' ? 'var(--gradient-primary)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <Shield size={18} /> Security & Auth
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg-col-span-9">
          <div className="glass-panel">
            {activeTab === 'profile' && (
              <div className="animate-fade-in-up">
                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Personal Information</h3>
                <div className="flex items-center gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
                  <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>{activeUser.initials}</div>
                  <div>
                    <button className="btn btn-secondary" style={{ marginBottom: '8px' }}>Change Photo</button>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>JPG, GIF or PNG. Max size 2MB.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" defaultValue={activeUser.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" defaultValue={activeUser.email} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control" defaultValue={activeUser.department} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-control" defaultValue={activeUser.title} />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                  {saved && <span style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600 }}>Changes saved successfully!</span>}
                  <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-fade-in-up">
                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Notification Preferences</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>
                  Choose how you want to be notified about goal submissions, approvals, and check-in reminders.
                </p>

                <div className="flex flex-col gap-lg">
                  {/* Email Notifications Toggle */}
                  <div className="glass-card flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
                    <div className="flex items-center gap-md">
                      <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Email Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Receive alerts via {activeUser.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailNotifs(!emailNotifs)}
                      style={{
                        width: '50px', height: '26px',
                        background: emailNotifs ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                        borderRadius: '13px', position: 'relative', cursor: 'pointer',
                        border: 'none', outline: 'none',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: emailNotifs ? '27px' : '3px',
                        width: '20px', height: '20px',
                        background: 'white', borderRadius: '50%',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}></div>
                    </button>
                  </div>

                  {/* MS Teams Notifications Toggle */}
                  <div className="glass-card flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
                    <div className="flex items-center gap-md">
                      <div style={{ width: '40px', height: '40px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-info)' }}>
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Microsoft Teams (Adaptive Cards)</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Get notifications in your MS Teams channel</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setTeamsNotifs(!teamsNotifs)}
                      style={{
                        width: '50px', height: '26px',
                        background: teamsNotifs ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                        borderRadius: '13px', position: 'relative', cursor: 'pointer',
                        border: 'none', outline: 'none',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: teamsNotifs ? '27px' : '3px',
                        width: '20px', height: '20px',
                        background: 'white', borderRadius: '50%',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}></div>
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                  {saved && <span style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600 }}>Preferences updated!</span>}
                  <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} /> Update Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>Identity & Access</h3>
                
                {/* 5.1 Requirement Simulation */}
                <div className="glass-card" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)', marginBottom: 'var(--space-xl)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                    <div className="flex items-center gap-md">
                      <div style={{ width: '32px', height: '32px', background: '#0078d4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>M</div>
                      <div style={{ fontWeight: 600 }}>Microsoft Entra ID (Azure AD)</div>
                    </div>
                    <span className="badge badge-active">Linked</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    Your account is managed by your organization&apos;s Microsoft Entra ID. SSO and role-based access control (RBAC) are active.
                  </p>
                  <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                      onClick={() => window.open('https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview', '_blank')}
                    >
                      <ExternalLink size={14} /> View Azure Profile
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'rgba(255,255,255,0.8)' }}>Session Management</h4>
                <div className="flex flex-col gap-sm">
                  <div className="glass-card flex items-center justify-between" style={{ padding: '12px var(--space-md)' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600 }}>Current Browser Session</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{getBrowserInfo()} &bull; {sessionLocation}</div>
                    </div>
                    <span className="badge badge-draft" style={{ fontSize: '0.6rem' }}>This Device</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
