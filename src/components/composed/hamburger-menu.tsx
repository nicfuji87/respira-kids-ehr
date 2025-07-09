import { Button } from "@/components/primitives"
import { Menu, Home, Users, Calendar, DollarSign, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export interface HamburgerMenuProps {
  isOpen: boolean
  onToggle: () => void
  onNavigate: (route: string) => void
  userRole?: 'admin' | 'doctor' | 'nurse' | 'receptionist'
  className?: string
}

const menuItems = {
  admin: [
    { icon: Home, label: 'Dashboard', route: '/dashboard' },
    { icon: Users, label: 'Pacientes', route: '/patients' },
    { icon: Calendar, label: 'Agendamentos', route: '/appointments' },
    { icon: DollarSign, label: 'Financeiro', route: '/financial' },
    { icon: Settings, label: 'Configurações', route: '/settings' },
  ],
  doctor: [
    { icon: Home, label: 'Dashboard', route: '/dashboard' },
    { icon: Users, label: 'Pacientes', route: '/patients' },
    { icon: Calendar, label: 'Agendamentos', route: '/appointments' },
  ],
  nurse: [
    { icon: Home, label: 'Dashboard', route: '/dashboard' },
    { icon: Users, label: 'Pacientes', route: '/patients' },
    { icon: Calendar, label: 'Agendamentos', route: '/appointments' },
  ],
  receptionist: [
    { icon: Home, label: 'Dashboard', route: '/dashboard' },
    { icon: Users, label: 'Pacientes', route: '/patients' },
    { icon: Calendar, label: 'Agendamentos', route: '/appointments' },
  ]
}

export const HamburgerMenu = ({ 
  isOpen, 
  onToggle, 
  onNavigate, 
  userRole = 'admin',
  className 
}: HamburgerMenuProps) => {
  const items = menuItems[userRole] || menuItems.admin

  const handleItemClick = (route: string) => {
    onNavigate(route)
    onToggle() // Fecha o menu após navegar
  }

  if (!isOpen) return null

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", className)}>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onToggle}
      />
      
      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-roxo-titulo">
              Menu
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => handleItemClick(item.route)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-bege-fundo"
                  >
                    <item.icon className="h-5 w-5 text-azul-respira" />
                    <span className="text-sm font-medium text-roxo-titulo">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={() => handleItemClick('/logout')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 text-vermelho-kids" />
              <span className="text-sm font-medium text-vermelho-kids">
                Sair
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

HamburgerMenu.displayName = "HamburgerMenu" 