'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import PopupBanner from '@/components/ui/PopupBanner'

export default function AppContent({
  children,
  interVariable,
  jakartaVariable
}: {
  children: React.ReactNode
  interVariable: string
  jakartaVariable: string
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <body 
      className={`${interVariable} ${jakartaVariable} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased min-h-screen flex flex-col overflow-x-hidden`}
      suppressHydrationWarning
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {!isAdminPage && <Navbar />}
        <main className="flex-1">
          {children}
        </main>
        {!isAdminPage && <Footer />}
        {!isAdminPage && <WhatsAppFloat />}
        {!isAdminPage && <PopupBanner />}
      </ThemeProvider>
    </body>
  )
}
