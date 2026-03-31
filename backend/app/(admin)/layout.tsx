import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminTopBar } from '@/components/admin/TopBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <AdminSidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <AdminTopBar />
        <main style={{ flex:1, padding:'32px 36px', overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
