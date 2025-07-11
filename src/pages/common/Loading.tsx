import React from 'react'
import { Spinner } from '@/components/primitives'

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-azul-respira/5 via-white to-verde-pipa/5">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img 
            src="/images/logos/icone-respira-kids.png" 
            alt="Respira KIDS" 
            className="w-16 h-16"
          />
          <img 
            src="/images/logos/nome-logo-respira-kids.png" 
            alt="Respira KIDS - Fisioterapia Respiratória Pediátrica" 
            className="h-8"
          />
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="xl" />
          <p className="text-roxo-titulo font-medium">
            {message}
          </p>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 opacity-10 pointer-events-none">
          <img 
            src="/images/brand/mao-catavento-respira-kids.png" 
            alt="Catavento" 
            className="w-32 h-32 animate-spin-slow"
          />
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 opacity-5 pointer-events-none">
          <img 
            src="/images/brand/fundo-respira-kids.png" 
            alt="Background" 
            className="w-48 h-48"
          />
        </div>
      </div>
    </div>
  )
}

export default Loading 