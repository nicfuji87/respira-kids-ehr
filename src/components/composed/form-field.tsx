import { Label, FormItem, FormControl, FormMessage } from "@/components/primitives"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  className?: string
  children?: React.ReactNode
  htmlFor?: string
}

export const FormField = ({ 
  label, 
  error, 
  required, 
  className, 
  children, 
  htmlFor 
}: FormFieldProps) => {
  return (
    <FormItem className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor} className="text-sm font-medium text-roxo-titulo">
          {label}
          {required && <span className="text-vermelho-kids ml-1">*</span>}
        </Label>
      )}
      <FormControl>
        {children}
      </FormControl>
      {error && (
        <FormMessage className="text-sm text-vermelho-kids">
          {error}
        </FormMessage>
      )}
    </FormItem>
  )
}

FormField.displayName = "FormField" 