import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/primitives"
import { Button } from "@/components/primitives"
import { Menu, Home, Users, Calendar, DollarSign, Settings, LogOut } from "lucide-react"

export interface MobileMenuProps {
  userRole?: 'admin' | 'doctor' | 'nurse' | 'receptionist'
  onNavigate?: (route: string) => void
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

export const MobileMenu = ({ 
  userRole = 'admin',
  onNavigate,
  className 
}: MobileMenuProps) => {
  const items = menuItems[userRole] || menuItems.admin

  const handleItemClick = (route: string) => {
    onNavigate?.(route)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-roxo-titulo">Menu</SheetTitle>
          <SheetDescription>
            Navegue pelas seções do sistema
          </SheetDescription>
        </SheetHeader>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.route}>
                <SheetClose asChild>
                  <button
                    onClick={() => handleItemClick(item.route)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-bege-fundo"
                  >
                    <item.icon className="h-5 w-5 text-azul-respira" />
                    <span className="text-sm font-medium text-roxo-titulo">
                      {item.label}
                    </span>
                  </button>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <SheetClose asChild>
            <button
              onClick={() => handleItemClick('/logout')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 text-vermelho-kids" />
              <span className="text-sm font-medium text-vermelho-kids">
                Sair
              </span>
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

MobileMenu.displayName = "MobileMenu" 