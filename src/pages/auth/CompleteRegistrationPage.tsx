import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { User, MapPin, Upload, Eye, Check, ArrowLeft, ArrowRight } from "lucide-react"

import { useAuth } from "@/hooks/auth/useAuth"
import { useCep } from "@/hooks/useCep"
import { useMask } from "@/hooks/useMask"
import { FormLayout } from "@/components/templates"
import { FormFieldWrapper } from "@/components/composed"
import { Button, Input, Form, Card, CardContent, CardHeader } from "@/components/primitives"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/select"
import { Spinner } from "@/components/primitives"
import { cn } from "@/lib/utils"

// Esquemas de validação
const baseSchema = z.object({
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => val.replace(/\D/g, '').length === 11, "CPF deve ter 11 dígitos"),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '')
      return cleaned.length >= 10 && cleaned.length <= 11
    }, "Telefone inválido"),
  data_nascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '')
      return cleaned.length === 8
    }, "Data inválida"),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((val) => val.replace(/\D/g, '').length === 8, "CEP deve ter 8 dígitos"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  complemento: z.string().optional(),
})

const professionalSchema = baseSchema.extend({
  numero_conselho: z.string().min(1, "Número do conselho é obrigatório"),
  especialidade: z.string().min(1, "Especialidade é obrigatória"),
  documento_conselho: z
    .any()
    .refine((file) => file instanceof File, "Documento do conselho é obrigatório")
    .refine((file) => file?.size <= 5000000, "Arquivo deve ter no máximo 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file?.type),
      "Apenas JPG, PNG ou PDF são aceitos"
    ),
})

type BaseFormData = z.infer<typeof baseSchema>
type ProfessionalFormData = z.infer<typeof professionalSchema>
type FormData = BaseFormData | ProfessionalFormData

const CompleteRegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [addressFetched, setAddressFetched] = useState(false)
  const [previewData, setPreviewData] = useState<FormData | null>(null)
  
  const { user, updateProfile } = useAuth()
  const { applyMask, removeMask } = useMask()
  const { fetchAddress, isLoading: isCepLoading } = useCep()
  const navigate = useNavigate()

  const isProfessional = user?.role === 'profissional'
  const schema = isProfessional ? professionalSchema : baseSchema

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cpf: "",
      telefone: "",
      data_nascimento: "",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
      ...(isProfessional && {
        numero_conselho: "",
        especialidade: "",
        documento_conselho: undefined,
      }),
    },
  })

  const watchedCep = form.watch("cep")

  // Buscar endereço quando CEP estiver completo
  React.useEffect(() => {
    const handleCepChange = async () => {
      const cleaned = removeMask(watchedCep)
      if (cleaned.length === 8 && !addressFetched) {
        const address = await fetchAddress(cleaned)
        if (address) {
          form.setValue("logradouro", address.street)
          form.setValue("bairro", address.neighborhood)
          form.setValue("cidade", address.city)
          form.setValue("estado", address.state)
          setAddressFetched(true)
        }
      } else if (cleaned.length < 8) {
        setAddressFetched(false)
      }
    }

    const timeoutId = setTimeout(handleCepChange, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedCep, fetchAddress, form, removeMask, addressFetched])

  const handleStepOne = (data: FormData) => {
    setPreviewData(data)
    setCurrentStep(2)
  }

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Remover máscaras dos dados
      const cleanData = {
        ...data,
        cpf: removeMask(data.cpf),
        telefone: removeMask(data.telefone),
        cep: removeMask(data.cep),
        data_nascimento: removeMask(data.data_nascimento),
      }

      // TODO: Implementar upload do documento se for profissional
      // TODO: Salvar dados no Supabase
      await updateProfile({
        cpfCnpj: cleanData.cpf
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Erro ao completar cadastro:', error)
      // TODO: Mostrar erro para o usuário
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepOne = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleStepOne)} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-roxo-titulo flex items-center">
            <User className="w-5 h-5 mr-2" />
            Dados Pessoais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper
              control={form.control}
              name="cpf"
              label="CPF"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    const masked = applyMask(e.target.value, 'cpf')
                    field.onChange(masked)
                  }}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="telefone"
              label="Telefone"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="(00) 00000-0000"
                  onChange={(e) => {
                    const masked = applyMask(e.target.value, 'phone')
                    field.onChange(masked)
                  }}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="data_nascimento"
              label="Data de Nascimento"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="DD/MM/AAAA"
                  onChange={(e) => {
                    const masked = applyMask(e.target.value, 'date')
                    field.onChange(masked)
                  }}
                />
              )}
            </FormFieldWrapper>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-roxo-titulo flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Endereço
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormFieldWrapper
              control={form.control}
              name="cep"
              label="CEP"
              required
            >
              {(field) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="00000-000"
                    onChange={(e) => {
                      const masked = applyMask(e.target.value, 'cep')
                      field.onChange(masked)
                    }}
                  />
                  {isCepLoading && (
                    <Spinner size="sm" className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                  )}
                </div>
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="logradouro"
              label="Logradouro"
              required
              className="md:col-span-2"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Rua, Avenida..."
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="numero"
              label="Número"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="123"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="bairro"
              label="Bairro"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Centro"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="complemento"
              label="Complemento"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Apartamento, sala..."
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="cidade"
              label="Cidade"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="São Paulo"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            </FormFieldWrapper>

            <FormFieldWrapper
              control={form.control}
              name="estado"
              label="Estado"
              required
            >
              {(field) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </FormFieldWrapper>
          </div>
        </div>

        {/* Dados Profissionais (se for profissional) */}
        {isProfessional && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-roxo-titulo flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Dados Profissionais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWrapper
                control={form.control}
                name="numero_conselho"
                label="Número do Conselho"
                required
              >
                {(field) => (
                  <Input
                    {...field}
                    placeholder="CRM 123456"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              </FormFieldWrapper>

              <FormFieldWrapper
                control={form.control}
                name="especialidade"
                label="Especialidade"
                required
              >
                {(field) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pneumologia">Pneumologia</SelectItem>
                      <SelectItem value="pediatria">Pediatria</SelectItem>
                      <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
                      <SelectItem value="psicologia">Psicologia</SelectItem>
                      <SelectItem value="nutricao">Nutrição</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormFieldWrapper>

              <FormFieldWrapper
                control={form.control}
                name="documento_conselho"
                label="Documento do Conselho"
                required
                description="Upload do documento do conselho profissional (JPG, PNG ou PDF - máx. 5MB)"
                className="md:col-span-2"
              >
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file || undefined)
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-azul-respira file:text-white hover:file:bg-azul-respira/90"
                    />
                  </div>
                )}
              </FormFieldWrapper>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Revisar dados
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-verde-pipa/10 rounded-full flex items-center justify-center">
          <Eye className="w-8 h-8 text-verde-pipa" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-roxo-titulo">Revisar Dados</h3>
          <p className="text-sm text-gray-600">
            Confira suas informações antes de finalizar
          </p>
        </div>
      </div>

      {previewData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h4 className="font-medium text-roxo-titulo">Dados Pessoais</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">CPF:</span>
                <span className="font-medium">{previewData.cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium">{previewData.telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Nascimento:</span>
                <span className="font-medium">{previewData.data_nascimento}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h4 className="font-medium text-roxo-titulo">Endereço</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">CEP:</span>
                <span className="font-medium">{previewData.cep}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Logradouro:</span>
                <span className="font-medium">{previewData.logradouro}, {previewData.numero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bairro:</span>
                <span className="font-medium">{previewData.bairro}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cidade/Estado:</span>
                <span className="font-medium">{previewData.cidade}/{previewData.estado}</span>
              </div>
              {previewData.complemento && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Complemento:</span>
                  <span className="font-medium">{previewData.complemento}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {isProfessional && 'numero_conselho' in previewData && (
            <Card>
              <CardHeader>
                <h4 className="font-medium text-roxo-titulo">Dados Profissionais</h4>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Conselho:</span>
                  <span className="font-medium">{previewData.numero_conselho}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Especialidade:</span>
                  <span className="font-medium">{previewData.especialidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documento:</span>
                  <span className="font-medium text-verde-pipa">✓ Anexado</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setCurrentStep(1)}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          onClick={() => previewData && handleSubmit(previewData)}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Finalizando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Finalizar cadastro
            </>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <FormLayout
      title="Completar cadastro"
      description={currentStep === 1 ? "Dados obrigatórios" : "Revisar informações"}
      maxWidth="lg"
      className="respira-bg-primary"
    >
      <div className="space-y-6">
        {/* Indicador de steps */}
        <div className="flex items-center justify-center space-x-4">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            currentStep >= 1 
              ? "bg-azul-respira text-white" 
              : "bg-gray-200 text-gray-500"
          )}>
            1
          </div>
          <div className={cn(
            "w-12 h-0.5",
            currentStep > 1 ? "bg-azul-respira" : "bg-gray-200"
          )} />
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            currentStep >= 2 
              ? "bg-azul-respira text-white" 
              : "bg-gray-200 text-gray-500"
          )}>
            2
          </div>
        </div>

        {currentStep === 1 ? renderStepOne() : renderPreview()}
      </div>
    </FormLayout>
  )
}

export default CompleteRegistrationPage 