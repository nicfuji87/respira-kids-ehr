import React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  showHomeIcon?: boolean
  className?: string
}

export const BreadcrumbNav = ({ 
  items, 
  showHomeIcon = true,
  className 
}: BreadcrumbNavProps) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {showHomeIcon && (
        <>
          <Home className="h-4 w-4 text-azul-respira" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.isActive ? (
            <a
              href={item.href}
              className="text-azul-respira hover:text-azul-respira/80 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                "font-medium",
                item.isActive ? "text-roxo-titulo" : "text-gray-600"
              )}
            >
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

BreadcrumbNav.displayName = "BreadcrumbNav" 