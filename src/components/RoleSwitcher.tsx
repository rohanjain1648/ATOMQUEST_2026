'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, User, ShieldAlert, Check } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

export default function RoleSwitcher() {
  const router = useRouter();
  const [activeId, setActiveId] = useState('emp-priya');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )prism_user_id=([^;]*)/);
    if (match && match[1]) {
      setActiveId(match[1]);
    } else {
      // Set default cookie if not exists
      document.cookie = "prism_user_id=emp-priya; path=/; max-age=31536000";
    }
  }, []);

  const personas: Persona[] = [
    {
      id: 'emp-priya',
      name: 'Priya Sharma',
      role: 'Employee (Locked)',
      icon: <User size={14} />,
      badge: 'Employee',
      badgeColor: 'var(--accent-info)'
    },
    {
      id: 'emp-neha',
      name: 'Neha Gupta',
      role: 'Employee (Submitted)',
      icon: <User size={14} />,
      badge: 'Employee',
      badgeColor: 'var(--accent-warning)'
    },
    {
      id: 'mgr-rohan',
      name: 'Rohan Jain',
      role: 'Manager & Admin',
      icon: <Users size={14} />,
      badge: 'Manager/L1',
      badgeColor: 'var(--accent-success)'
    }
  ];

  const handlePersonaChange = (id: string) => {
    setActiveId(id);
    document.cookie = `prism_user_id=${id}; path=/; max-age=31536000`;
    setIsOpen(false);
    
    // Smooth reload to update server components
    router.refresh();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const currentPersona = personas.find(p => p.id === activeId) || personas[0];

  return (
    <div style={{ position: 'relative', zIndex: 999 }}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          outline: 'none',
          boxShadow: isOpen ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }}
      >
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: currentPersona.badgeColor, boxShadow: `0 0 10px ${currentPersona.badgeColor}` }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Journey: {currentPersona.name}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          background: currentPersona.badgeColor + '20', 
          color: currentPersona.badgeColor, 
          padding: '2px 8px', 
          borderRadius: '10px',
          border: `1px solid ${currentPersona.badgeColor}30`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {currentPersona.badge}
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Overlay to close */}
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} />
          
          <div 
            className="glass-panel" 
            style={{
              position: 'absolute',
              top: '45px',
              left: 0,
              width: '280px',
              background: 'rgba(10, 13, 22, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), var(--glow-primary)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', padding: '4px 8px 8px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
              SELECT USER JOURNEY / ROLE
            </div>
            
            {personas.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id)}
                  style={{
                    background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '6px', 
                      background: isActive ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)'
                    }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.8)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{p.role}</div>
                    </div>
                  </div>
                  {isActive && <Check size={16} color="var(--accent-primary)" style={{ marginRight: '4px' }} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
