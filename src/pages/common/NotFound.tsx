import React from 'react'
import { Button } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-azul-respira/5 via-white to-verde-pipa/5">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center items-center space-x-4 mb-8">
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

        {/* 404 Error */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-azul-respira">404</h1>
          <h2 className="text-2xl font-semibold text-roxo-titulo">
            Página não encontrada
          </h2>
          <p className="text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
          >
            Ir para Dashboard
          </Button>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 opacity-10 pointer-events-none">
          <img 
            src="/images/brand/mao-catavento-respira-kids.png" 
            alt="Catavento" 
            className="w-32 h-32"
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

export default NotFound 