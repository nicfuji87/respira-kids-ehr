import { Label } from "@/components/primitives"
import { cn } from "@/lib/utils"

/**
 * @deprecated Use FormFieldWrapper instead. This component will be removed in v2.0.0
 * @see FormFieldWrapper for shadcn/react-hook-form integration
 */
export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  htmlFor?: string
  className?: string
  children: React.ReactNode
}

/**
 * @deprecated Use FormFieldWrapper instead. This component will be removed in v2.0.0
 * 
 * Legacy form field component. For new forms, use FormFieldWrapper with react-hook-form.
 * 
 * @example
 * // OLD (deprecated)
 * <FormField label="Name" error={errors.name}>
 *   <input {...} />
 * </FormField>
 * 
 * // NEW (recommended)
 * <FormFieldWrapper control={control} name="name" label="Name">
 *   {(field) => <Input {...field} />}
 * </FormFieldWrapper>
 */
export const FormField = ({
  label,
  error,
  required = false,
  htmlFor,
  className,
  children
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={htmlFor}
          className="text-roxo-titulo font-medium"
        >
          {label}
          {required && <span className="text-vermelho-kids ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-vermelho-kids">
          {error}
        </p>
      )}
    </div>
  )
}

FormField.displayName = "FormField" 