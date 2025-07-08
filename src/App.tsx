import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Respira Kids EHR</h1>
          <p className="text-muted-foreground">Sistema de Prontuário Eletrônico</p>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full">Button Padrão</Button>
          <Button variant="secondary" className="w-full">Button Secondary</Button>
          <Button variant="outline" className="w-full">Button Outline</Button>
          <Button variant="destructive" className="w-full">Button Destructive</Button>
          <Button variant="ghost" className="w-full">Button Ghost</Button>
          <Button variant="link" className="w-full">Button Link</Button>
        </div>
      </div>
    </div>
  )
}

export default App
