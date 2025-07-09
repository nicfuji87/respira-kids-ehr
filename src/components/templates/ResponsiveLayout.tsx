import * as React from "react"
import { cn } from "@/lib/utils"

// ==================== TYPES ====================

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  active?: boolean
  badge?: string | number
  onClick?: () => void
}

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  active?: boolean
  badge?: string | number
  children?: SidebarItem[]
  collapsed?: boolean
  onClick?: () => void
}

export interface HeaderAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
}

export interface ResponsiveLayoutProps {
  children: React.ReactNode
  
  // Header configuration
  title?: string
  subtitle?: string
  headerActions?: HeaderAction[]
  showBackButton?: boolean
  onBackClick?: () => void
  
  // Mobile layout configuration
  bottomTabs?: TabItem[]
  showBottomTabs?: boolean
  
  // Desktop layout configuration
  sidebarItems?: SidebarItem[]
  showSidebar?: boolean
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
  contextualSidebar?: React.ReactNode
  
  // Layout customization
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  
  // Page-specific overrides
  forceLayout?: 'mobile' | 'desktop'
  customBreakpoint?: number
}

// ==================== HOOKS ====================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

function useResponsiveLayout(customBreakpoint?: number) {
  const breakpoint = customBreakpoint || 1024 // lg breakpoint
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [isDesktop])

  return { isDesktop, isTransitioning }
}

// ==================== SUB-COMPONENTS ====================

interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: HeaderAction[]
  showBackButton?: boolean
  onBackClick?: () => void
  className?: string
  isDesktop?: boolean
  onSidebarToggle?: () => void
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions = [],
  showBackButton,
  onBackClick,
  className,
  isDesktop,
  onSidebarToggle
}) => (
  <header className={cn(
    // Respira KIDS header styling
    "flex items-center justify-between px-4 py-3 bg-[hsl(var(--bege-fundo))] border-b border-zinc-200",
    "theme-transition",
    className
  )}>
    <div className="flex items-center gap-3">
      {/* Mobile: Back button, Desktop: Sidebar toggle */}
      {(showBackButton || isDesktop) && (
        <button
          onClick={isDesktop ? onSidebarToggle : onBackClick}
          className={cn(
            "p-2 rounded-md hover:bg-zinc-100 theme-transition",
            "min-h-[44px] min-w-[44px] flex items-center justify-center"
          )}
          aria-label={isDesktop ? "Toggle sidebar" : "Go back"}
        >
          {isDesktop ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      )}
      
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-[hsl(var(--roxo-titulo))] leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-zinc-600">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    {actions.length > 0 && (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium theme-transition",
              "min-h-[44px] flex items-center gap-2",
              {
                "bg-[hsl(var(--azul-respira))] text-white hover:bg-[hsl(var(--azul-respira))]/90": 
                  action.variant === 'primary',
                "bg-[hsl(var(--bege-fundo))] text-[hsl(var(--roxo-titulo))] hover:bg-zinc-200": 
                  action.variant === 'secondary',
                "hover:bg-zinc-100 text-zinc-700": 
                  action.variant === 'ghost' || !action.variant
              }
            )}
          >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
    )}
  </header>
)

interface BottomTabsProps {
  tabs: TabItem[]
  className?: string
}

const BottomTabs: React.FC<BottomTabsProps> = ({ tabs, className }) => (
  <nav className={cn(
    // Mobile bottom navigation with Respira KIDS styling
    "fixed bottom-0 left-0 right-0 z-40 bg-[hsl(var(--bege-fundo))] border-t border-zinc-200",
    "flex items-center justify-around px-2 py-2 safe-area-pb",
    "theme-transition",
    className
  )}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={tab.onClick}
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 rounded-lg theme-transition",
          "min-h-[60px] min-w-[60px] relative",
          {
            "bg-[hsl(var(--azul-respira))]/10 text-[hsl(var(--azul-respira))]": tab.active,
            "text-zinc-600 hover:text-[hsl(var(--azul-respira))] hover:bg-zinc-100": !tab.active
          }
        )}
      >
        {tab.icon && (
          <div className="relative">
            {tab.icon}
            {tab.badge && (
              <span className="absolute -top-1 -right-1 bg-[hsl(var(--vermelho-kids))] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </div>
        )}
        <span className="text-xs font-medium truncate max-w-[60px]">
          {tab.label}
        </span>
      </button>
    ))}
  </nav>
)

interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ items, collapsed, className }) => (
  <aside className={cn(
    // Desktop sidebar with Respira KIDS styling
    "bg-[hsl(var(--bege-fundo))] border-r border-zinc-200 flex flex-col",
    "theme-transition-all duration-300",
    {
      "w-64": !collapsed,
      "w-16": collapsed
    },
    className
  )}>
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={item.onClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left theme-transition",
              "min-h-[44px]",
              {
                "bg-[hsl(var(--azul-respira))]/10 text-[hsl(var(--azul-respira))] border-l-2 border-[hsl(var(--azul-respira))]": 
                  item.active,
                "text-zinc-700 hover:bg-zinc-100 hover:text-[hsl(var(--azul-respira))]": 
                  !item.active
              }
            )}
          >
            {item.icon && (
              <div className="flex-shrink-0 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-[hsl(var(--vermelho-kids))] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate">{item.label}</span>
              </div>
            )}
          </button>
          
          {/* Nested items */}
          {!collapsed && item.children && item.children.length > 0 && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <button
                  key={child.id}
                  onClick={child.onClick}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1 rounded-md text-left text-sm theme-transition",
                    "min-h-[36px]",
                    {
                      "bg-[hsl(var(--azul-respira))]/5 text-[hsl(var(--azul-respira))]": child.active,
                      "text-zinc-600 hover:bg-zinc-50 hover:text-[hsl(var(--azul-respira))]": !child.active
                    }
                  )}
                >
                  {child.icon}
                  <span className="truncate">{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  </aside>
)

// ==================== LAYOUT COMPONENTS ====================

interface MobileLayoutProps {
  children: React.ReactNode
  header: React.ReactNode
  bottomTabs?: React.ReactNode
  showBottomTabs?: boolean
  contentClassName?: string
  isTransitioning?: boolean
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  header,
  bottomTabs,
  showBottomTabs,
  contentClassName,
  isTransitioning
}) => (
  <div className={cn(
    "flex flex-col h-screen bg-white",
    "theme-transition-all duration-300",
    { "opacity-50": isTransitioning }
  )}>
    {header}
    
    <main className={cn(
      "flex-1 overflow-y-auto",
      {
        "pb-20": showBottomTabs, // Space for bottom tabs
        "pb-4": !showBottomTabs
      },
      contentClassName
    )}>
      {children}
    </main>
    
    {showBottomTabs && bottomTabs}
  </div>
)

interface DesktopLayoutProps {
  children: React.ReactNode
  header: React.ReactNode
  sidebar?: React.ReactNode
  contextualSidebar?: React.ReactNode
  showSidebar?: boolean
  contentClassName?: string
  isTransitioning?: boolean
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  header,
  sidebar,
  contextualSidebar,
  showSidebar,
  contentClassName,
  isTransitioning
}) => (
  <div className={cn(
    "flex flex-col h-screen bg-white",
    "theme-transition-all duration-300",
    { "opacity-50": isTransitioning }
  )}>
    {header}
    
    <div className="flex flex-1 overflow-hidden">
      {showSidebar && sidebar}
      
      <main className={cn(
        "flex-1 overflow-y-auto",
        contentClassName
      )}>
        {children}
      </main>
      
      {contextualSidebar && (
        <aside className="w-80 bg-[hsl(var(--bege-fundo))] border-l border-zinc-200 overflow-y-auto">
          {contextualSidebar}
        </aside>
      )}
    </div>
  </div>
)

// ==================== MAIN COMPONENT ====================

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  subtitle,
  headerActions = [],
  showBackButton = false,
  onBackClick,
  bottomTabs = [],
  showBottomTabs = true,
  sidebarItems = [],
  showSidebar = true,
  sidebarCollapsed = false,
  onSidebarToggle,
  contextualSidebar,
  className,
  contentClassName,
  headerClassName,
  forceLayout,
  customBreakpoint
}) => {
  const { isDesktop, isTransitioning } = useResponsiveLayout(customBreakpoint)
  const layoutMode = forceLayout || (isDesktop ? 'desktop' : 'mobile')

  const headerComponent = (
    <Header
      title={title}
      subtitle={subtitle}
      actions={headerActions}
      showBackButton={showBackButton}
      onBackClick={onBackClick}
      className={headerClassName}
      isDesktop={layoutMode === 'desktop'}
      onSidebarToggle={onSidebarToggle}
    />
  )

  const sidebarComponent = showSidebar && sidebarItems.length > 0 ? (
    <Sidebar
      items={sidebarItems}
      collapsed={sidebarCollapsed}
    />
  ) : null

  const bottomTabsComponent = showBottomTabs && bottomTabs.length > 0 ? (
    <BottomTabs tabs={bottomTabs} />
  ) : null

  return (
    <div className={cn("h-screen overflow-hidden", className)}>
      {layoutMode === 'mobile' ? (
        <MobileLayout
          header={headerComponent}
          bottomTabs={bottomTabsComponent}
          showBottomTabs={showBottomTabs && bottomTabs.length > 0}
          contentClassName={contentClassName}
          isTransitioning={isTransitioning}
        >
          {children}
        </MobileLayout>
      ) : (
        <DesktopLayout
          header={headerComponent}
          sidebar={sidebarComponent}
          contextualSidebar={contextualSidebar}
          showSidebar={showSidebar && sidebarItems.length > 0}
          contentClassName={contentClassName}
          isTransitioning={isTransitioning}
        >
          {children}
        </DesktopLayout>
      )}
    </div>
  )
}

export default ResponsiveLayout 