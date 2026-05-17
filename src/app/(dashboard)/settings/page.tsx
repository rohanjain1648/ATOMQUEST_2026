'use client';

import { useState } from 'react';
import { User, Bell, Shield, Mail, MessageSquare, Save, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

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
                  <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>RJ</div>
                  <div>
                    <button className="btn btn-secondary" style={{ marginBottom: '8px' }}>Change Photo</button>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>JPG, GIF or PNG. Max size 2MB.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" defaultValue="Rohan Jain" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" defaultValue="rohan.jain@atomquest.com" disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control" defaultValue="Engineering" disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-control" defaultValue="Senior Developer" />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary">
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
                  <div className="glass-card flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
                    <div className="flex items-center gap-md">
                      <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Email Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Receive alerts via rohan.jain@atomquest.com</div>
                      </div>
                    </div>
                    <div style={{ width: '50px', height: '24px', background: 'var(--accent-primary)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                  </div>

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
                    <div style={{ width: '50px', height: '24px', background: 'var(--accent-primary)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary">
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
                    Your account is managed by your organization's Microsoft Entra ID. SSO and role-based access control (RBAC) are active.
                  </p>
                  <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                      <ExternalLink size={14} /> View Azure Profile
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'rgba(255,255,255,0.8)' }}>Session Management</h4>
                <div className="flex flex-col gap-sm">
                  <div className="glass-card flex items-center justify-between" style={{ padding: '12px var(--space-md)' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600 }}>Current Browser Session</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Chrome on Windows • Bangalore, India</div>
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
