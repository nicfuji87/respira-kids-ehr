import * as React from "react"
import { Input } from "@/components/primitives/input"
import { Button } from "@/components/primitives/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// SearchInput - NÍVEL 2: Combinação de primitivos
// Segue template obrigatório para componentes compostos

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar...",
  className
}) => {
  return (
    <div className={cn("flex w-full items-center space-x-2", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button onClick={onSearch} size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
} 