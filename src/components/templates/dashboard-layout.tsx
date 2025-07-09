import * as React from "react"
import { cn } from "@/lib/utils"

// DashboardLayout - NÍVEL 4: Layout completo
// Segue template obrigatório para layouts usando CSS variables do tema

export interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  sidebar,
  header,
  className
}) => {
  return (
    <div className={cn("min-h-screen bg-[hsl(var(--bege-fundo))] theme-transition", className)}>
      {/* Header */}
      {header && (
        <header className="bg-white border-b border-zinc-200 px-6 py-4 theme-transition">
          {header}
        </header>
      )}
      
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 bg-white border-r border-zinc-200 min-h-screen theme-transition">
            {sidebar}
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[hsl(var(--roxo-titulo))]">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
} 