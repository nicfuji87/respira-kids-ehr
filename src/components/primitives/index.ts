// Primitives - Nível 1
// Componentes básicos reutilizáveis baseados em shadcn/ui

// Form Components
export { Button } from "./button"
export { buttonVariants } from "./button.variants"
export { Input } from "./input"
export { Label } from "./label"
export { 
  Form,
  FormControl, 
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./form"

// Layout Components
export { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "./card"

// Feedback Components
export { Badge } from "./badge"
export { badgeVariants } from "./badge.variants"
export { Alert, AlertDescription, AlertTitle } from "./alert"
export { Spinner } from "./spinner"

// Overlay Components
export { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "./dialog"
export { Modal } from "./modal"
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger
} from "./sheet"

// Navigation Components
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "./select"
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./dropdown-menu"
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./tabs"
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./breadcrumb"

// Media Components
export { Avatar, AvatarFallback, AvatarImage } from "./avatar"

// Types
export type { ButtonProps } from "./button" 