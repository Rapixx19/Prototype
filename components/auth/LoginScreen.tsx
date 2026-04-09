'use client'

import { useRouter } from 'next/navigation'
import { Crown, Calendar, BarChart2, BookOpen } from 'lucide-react'
import { setRole } from '@/lib/auth'
import type { Role } from '@/lib/types'
import { RoleCard } from './RoleCard'

const ROLES: {
  role: Role
  label: string
  description: string
  access: string[]
  color: string
  icon: React.ReactNode
}[] = [
  {
    role: 'owner',
    label: 'Owner / Managing Partner',
    description: 'Full system access — all projects, financials, team, and intelligence',
    access: [
      'Full dashboard',
      'All projects & financials',
      'Team overview',
      'All insights',
      'OneDrive admin',
    ],
    color: '#00C8F0',
    icon: <Crown size={20} />,
  },
  {
    role: 'secretary',
    label: 'Executive Assistant',
    description: 'Calendar focus — meetings, contacts, document management',
    access: [
      'Calendar & meeting briefs',
      'Contact management',
      'Document library',
      'No financials',
    ],
    color: '#9B59FF',
    icon: <Calendar size={20} />,
  },
  {
    role: 'employee',
    label: 'Senior Analyst',
    description: 'Project work — assigned deals, documents, and tasks',
    access: [
      'Assigned projects only',
      'Task management',
      'Document access',
      'No team view',
    ],
    color: '#00D68F',
    icon: <BarChart2 size={20} />,
  },
  {
    role: 'intern',
    label: 'Analyst Intern',
    description: 'Limited access — shared documents and assigned tasks',
    access: [
      'Shared documents only',
      'Assigned tasks',
      'No projects or contacts',
    ],
    color: '#F5A623',
    icon: <BookOpen size={20} />,
  },
]

export function LoginScreen() {
  const router = useRouter()

  const handleLogin = (role: Role) => {
    setRole(role)
    router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen bg-app-bg flex items-center justify-center p-8"
      style={{
        backgroundImage: 'radial-gradient(circle, #1A2035 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="font-syne font-bold text-accent text-2xl tracking-widest mb-1">
            VECTERAI
          </div>
          <div className="font-dm text-text-dim text-sm tracking-widest mb-6">
            KNOWLEDGE OS &middot; DEMO PROTOTYPE
          </div>
          <div className="font-syne font-bold text-text-primary text-3xl">
            Select your role to continue
          </div>
          <div className="font-dm text-text-mid text-base mt-2">
            Each role has a different level of access. Try Owner first, then switch to Secretary.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((r) => (
            <RoleCard
              key={r.role}
              role={r.role}
              label={r.label}
              description={r.description}
              access={r.access}
              color={r.color}
              icon={r.icon}
              onClick={() => handleLogin(r.role)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <span className="text-text-dim text-xs font-dm">
            This is a prototype demo. All data is synthetic. Powered by VecterAI Consulting &middot; vecterai.com
          </span>
        </div>
      </div>
    </div>
  )
}
