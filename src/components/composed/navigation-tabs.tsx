import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/primitives"
import { Badge } from "@/components/primitives"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface NavigationTab {
  id: string
  icon: LucideIcon
  label: string
  badgeCount?: number
  content?: React.ReactNode
}

export interface NavigationTabsProps {
  tabs: NavigationTab[]
  defaultValue?: string
  onTabChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const NavigationTabs = ({ 
  tabs,
  defaultValue,
  onTabChange,
  orientation = 'horizontal',
  className 
}: NavigationTabsProps) => {
  return (
    <Tabs 
      defaultValue={defaultValue || tabs[0]?.id} 
      orientation={orientation}
      onValueChange={onTabChange}
      className={className}
    >
      <TabsList className={cn(
        "grid w-full",
        orientation === 'horizontal' 
          ? `grid-cols-${tabs.length}` 
          : 'grid-cols-1 h-auto'
      )}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className={cn(
              "relative flex items-center gap-2",
              orientation === 'vertical' && "justify-start px-4 py-3"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className={cn(
              orientation === 'horizontal' && "hidden sm:inline"
            )}>
              {tab.label}
            </span>
            {tab.badgeCount && tab.badgeCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.content || (
            <div className="text-center text-gray-500 py-8">
              Conteúdo da aba {tab.label}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

NavigationTabs.displayName = "NavigationTabs" 