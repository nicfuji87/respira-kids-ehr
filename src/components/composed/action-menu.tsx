import { Button } from "@/components/primitives"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/primitives/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export interface ActionMenuItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  trigger?: React.ReactNode
  className?: string
}

export const ActionMenu = ({ items, trigger, className }: ActionMenuProps) => {
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Abrir menu</span>
    </Button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        {items.map((item, index) => (
          <div key={index}>
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={item.variant === 'destructive' ? 'text-vermelho-kids focus:text-vermelho-kids' : ''}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
            {index < items.length - 1 && item.variant === 'destructive' && (
              <DropdownMenuSeparator />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

ActionMenu.displayName = "ActionMenu" 