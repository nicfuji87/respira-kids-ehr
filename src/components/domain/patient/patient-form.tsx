import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/primitives/card"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { Button } from "@/components/primitives/button"
import { cn } from "@/lib/utils"

// PatientForm - NÍVEL 3: Componente específico do negócio
// TODO: Implementar funcionalidade completa com validação

export interface PatientFormProps {
  initialData?: {
    name?: string
    email?: string
    phone?: string
    age?: number
  }
  onSubmit?: (data: any) => void
  onCancel?: () => void
  className?: string
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className
}) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    age: initialData?.age || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <h2 className="text-xl font-semibold">Dados do Paciente</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Digite o nome completo"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Digite o email"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Digite o telefone"
            />
          </div>
          
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="Digite a idade"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 