import * as React from "react"
import { AuthContext, type AuthContextValue } from "@/contexts/auth.utils"

// ==================== HOOK ====================

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
} 