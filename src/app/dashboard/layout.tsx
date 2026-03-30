import Navbar from '@/components/nav/navbar'
import Sidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-14 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
