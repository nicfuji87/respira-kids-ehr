import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/primitives"
import { cn } from "@/lib/utils"
import type { Control, FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form"

export interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  required?: boolean
  className?: string
  children: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode
}

export const FormFieldWrapper = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required = false,
  className,
  children
}: FormFieldWrapperProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-roxo-titulo font-medium">
              {label}
              {required && <span className="text-vermelho-kids ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {children(field)}
          </FormControl>
          {description && (
            <FormDescription className="text-sm text-gray-600">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-vermelho-kids text-sm" />
        </FormItem>
      )}
    />
  )
}

FormFieldWrapper.displayName = "FormFieldWrapper" 