import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/primitives"
import { Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

export interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  showHomeIcon?: boolean
  className?: string
}

export const PageBreadcrumb = ({ 
  items, 
  showHomeIcon = true,
  className 
}: PageBreadcrumbProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 0 && <BreadcrumbSeparator />}
          </>
        )}
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href && !item.isActive ? (
                <BreadcrumbLink 
                  href={item.href}
                  className="text-azul-respira hover:text-azul-respira/80"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-roxo-titulo font-medium">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

PageBreadcrumb.displayName = "PageBreadcrumb" 