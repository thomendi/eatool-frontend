import { Outlet } from 'react-router'
import { Sidebar } from '@/general/components/Sidebar.tsx'
import { Header } from '@/general/components/Header.tsx'
import { Toaster } from 'react-hot-toast'

export const GeneralLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Toaster />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
