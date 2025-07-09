import { Button, Badge } from "@/components/primitives"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface TabButtonProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  badgeCount?: number
  onClick: () => void
  className?: string
}

export const TabButton = ({ 
  icon: Icon, 
  label, 
  isActive = false,
  badgeCount,
  onClick,
  className 
}: TabButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "relative flex h-16 w-full flex-col items-center justify-center gap-1 rounded-none border-0 px-2 py-2 text-xs font-medium transition-colors",
        isActive 
          ? "bg-azul-respira/10 text-azul-respira" 
          : "text-gray-500 hover:text-azul-respira hover:bg-azul-respira/5",
        className
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {badgeCount && badgeCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] font-bold"
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        )}
      </div>
      <span className="truncate">{label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-azul-respira" />
      )}
    </Button>
  )
}

TabButton.displayName = "TabButton" 