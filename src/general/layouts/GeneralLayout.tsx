
import { Outlet } from 'react-router'
import { Sidebar } from '@/general/components/Sidebar.tsx'
import {Toaster} from 'react-hot-toast'




export const GeneralLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Toaster/>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
        
      </main>
    </div>
  
  )
}
