import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

export interface ModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  trigger?: React.ReactNode
  className?: string
}

export const Modal = ({ 
  children, 
  open, 
  onOpenChange, 
  title, 
  description, 
  trigger,
  className 
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

Modal.displayName = "Modal" 