import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { SocketProvider } from "@/lib/socket-context"
import { CursorEffects, CursorEffectsProvider } from "@/components/cursor-effects"
import { CursorToggle } from "@/components/cursor-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PLANIT - AI-Powered Task Management",
  description: "Streamline your workflow with intelligent task management and collaboration tools.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SocketProvider>
              <CursorEffectsProvider>
                <CursorEffects trailCount={3} glowIntensity={0.8} />
                <CursorToggle />
                {children}
                <Toaster />
              </CursorEffectsProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
