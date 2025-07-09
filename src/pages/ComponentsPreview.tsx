import { useState } from "react"
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Spinner,
  Modal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives"
import { 
  Heart, 
  Star, 
  Settings, 
  User, 
  Mail, 
  Phone,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from "lucide-react"

export const ComponentsPreview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectValue, setSelectValue] = useState("")

  return (
    <div className="min-h-screen bg-bege-fundo p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-roxo-titulo text-center">
              🎨 Respira KIDS - Componentes Primitivos
            </CardTitle>
            <p className="text-center text-gray-600">
              Visualização de todos os componentes primitivos do sistema
            </p>
          </CardHeader>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Heart className="h-4 w-4" /></Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button>
                <Star className="mr-2 h-4 w-4" />
                With Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs and Forms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Inputs & Forms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input
                  id="disabled"
                  placeholder="Disabled input"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="select">Select</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opcao1">Opção 1</SelectItem>
                    <SelectItem value="opcao2">Opção 2</SelectItem>
                    <SelectItem value="opcao3">Opção 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Simples</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo do card simples.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Card com Ícone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Card com ícone no título.</p>
                </CardContent>
              </Card>
              
              <Card className="border-azul-respira">
                <CardHeader>
                  <CardTitle className="text-azul-respira">Card Destacado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Card com estilo personalizado.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-azul-respira text-white">Azul Respira</Badge>
              <Badge className="bg-verde-pipa text-white">Verde Pipa</Badge>
              <Badge className="bg-amarelo-pipa text-black">Amarelo Pipa</Badge>
              <Badge className="bg-roxo-titulo text-white">Roxo Título</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informação!</AlertTitle>
              <AlertDescription>
                Este é um alerta informativo padrão.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-verde-pipa bg-green-50">
              <CheckCircle className="h-4 w-4 text-verde-pipa" />
              <AlertTitle className="text-verde-pipa">Sucesso!</AlertTitle>
              <AlertDescription>
                Operação realizada com sucesso.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-amarelo-pipa bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-amarelo-pipa" />
              <AlertTitle className="text-amarelo-pipa">Atenção!</AlertTitle>
              <AlertDescription>
                Verifique os dados antes de continuar.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-vermelho-kids bg-red-50">
              <XCircle className="h-4 w-4 text-vermelho-kids" />
              <AlertTitle className="text-vermelho-kids">Erro!</AlertTitle>
              <AlertDescription>
                Ocorreu um erro durante a operação.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarFallback className="bg-azul-respira text-white">RS</AvatarFallback>
              </Avatar>
              
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-roxo-titulo text-white text-lg">KD</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Spinners */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Spinners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Spinner size="sm" />
                <Spinner size="default" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Spinner variant="default" />
                <Spinner variant="secondary" />
                <Spinner variant="success" />
                <Spinner variant="warning" />
                <Spinner variant="destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dropdown Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Dropdown Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Telefone
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem className="text-vermelho-kids">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>
              Abrir Modal
            </Button>
            
            <Modal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Modal de Exemplo"
              description="Este é um modal de demonstração dos componentes primitivos."
            >
              <div className="space-y-4">
                <p>Conteúdo do modal aqui...</p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsModalOpen(false)}>
                    Fechar
                  </Button>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Modal>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Paleta de Cores Respira KIDS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-azul-respira rounded-lg"></div>
                <p className="text-sm font-medium">Azul Respira</p>
                <code className="text-xs">bg-azul-respira</code>
              </div>
              
              <div className="space-y-2">
                <div className="h-16 bg-roxo-titulo rounded-lg"></div>
                <p className="text-sm font-medium">Roxo Título</p>
                <code className="text-xs">bg-roxo-titulo</code>
              </div>
              
              <div className="space-y-2">
                <div className="h-16 bg-bege-fundo rounded-lg border"></div>
                <p className="text-sm font-medium">Bege Fundo</p>
                <code className="text-xs">bg-bege-fundo</code>
              </div>
              
              <div className="space-y-2">
                <div className="h-16 bg-verde-pipa rounded-lg"></div>
                <p className="text-sm font-medium">Verde Pipa</p>
                <code className="text-xs">bg-verde-pipa</code>
              </div>
              
              <div className="space-y-2">
                <div className="h-16 bg-amarelo-pipa rounded-lg"></div>
                <p className="text-sm font-medium">Amarelo Pipa</p>
                <code className="text-xs">bg-amarelo-pipa</code>
              </div>
              
              <div className="space-y-2">
                <div className="h-16 bg-vermelho-kids rounded-lg"></div>
                <p className="text-sm font-medium">Vermelho Kids</p>
                <code className="text-xs">bg-vermelho-kids</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComponentsPreview 