'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import PropertyModal from '@/components/PropertyModal'
import { useImoveis } from '@/hooks/useImoveis'

interface Imovel {
  idimovel: number
  titulo: string
  descricao: string
  preco: number
  endereco: string
  imagem: string
  tipo: string
  metragem: number
  quarto: number
  banheiro: number
  vaga: number
  transacao_idtransacao: number
}

interface PaginationData {
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}

interface ApiResponse {
  items: Imovel[]
  pagination: PaginationData
}

interface ImageWithLoadingProps {
  src: string
  alt: string
  onError: (e: any) => void
}

const LazyImage = ({ src, alt, onError }: ImageWithLoadingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={imageRef} className="relative h-48">
      {isVisible ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-300 ease-in-out"
          onError={onError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          quality={75}
          blurDataURL="/images/placeholder-house.jpg"
          placeholder="blur"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

export default function Imoveis() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialPage = parseInt(searchParams.get('page') || '1')
  const initialTipo = searchParams.get('tipo') || ''
  const selectedImovelId = searchParams.get('imovel')
  
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [tipoImovel, setTipoImovel] = useState(initialTipo)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(
    selectedImovelId ? parseInt(selectedImovelId) : null
  )

  const [previousParams, setPreviousParams] = useState<string>('')

  const {
    imoveis,
    pagination,
    isLoading,
    isError,
    mutate
  } = useImoveis(currentPage, tipoImovel)

  const handlePropertyClick = (propertyId: number) => {
    // Salva os parâmetros atuais antes de modificar a URL
    setPreviousParams(searchParams.toString())
    
    // Cria uma nova URL apenas com o parâmetro do imóvel
    router.push(`${pathname}?imovel=${propertyId}`)
    setSelectedProperty(propertyId)
  }

  const handleCloseModal = () => {
    // Restaura os parâmetros anteriores
    if (previousParams) {
      router.push(`${pathname}?${previousParams}`)
    } else {
      router.push(pathname)
    }
    setSelectedProperty(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  const handleTipoChange = (tipo: string) => {
    setTipoImovel(tipo)
    setCurrentPage(1)
    const newSearchParams = new URLSearchParams()
    if (tipo) newSearchParams.set('tipo', tipo)
    newSearchParams.set('page', '1')
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  useEffect(() => {
    if (selectedImovelId) {
      setSelectedProperty(parseInt(selectedImovelId))
    }
  }, [selectedImovelId])

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null

    const pages = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(pagination.totalPages, currentPage + 2)

    // Adicionar primeira página e reticências
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Adicionar páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Adicionar última página e reticências
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push('...')
      }
      pages.push(pagination.totalPages)
    }

    return (
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Anterior
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === 'number' && handlePageChange(page)
            }
            disabled={page === '...' || page === currentPage}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : page === '...'
                ? 'text-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
          className="rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Imóveis</h1>

      {/* Filter section */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleTipoChange('')}
            className={`px-4 py-2 rounded-md ${
              tipoImovel === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleTipoChange('1')}
            className={`px-4 py-2 rounded-md ${
              tipoImovel === '1'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Aluguel
          </button>
          <button
            onClick={() => handleTipoChange('2')}
            className={`px-4 py-2 rounded-md ${
              tipoImovel === '2'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Venda
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar imóveis
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Ocorreu um erro ao carregar a lista de imóveis. Por favor, tente
                  novamente mais tarde.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Property grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {imoveis.map((imovel) => (
              <div
                key={imovel.idimovel}
                className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-[1.02]"
                onClick={() => handlePropertyClick(imovel.idimovel)}
                role="button"
                tabIndex={0}
              >
                <div className="relative h-48">
                  <Image
                    src={
                      imovel.imagem
                        ? `https://adminmediaplus1.websiteseguro.com/projetos/telinveste/uploads/galeriaimovel_imagem/${imovel.idimovel}/${imovel.imagem}`
                        : '/images/placeholder-house.jpg'
                    }
                    alt={imovel.titulo}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e: any) => {
                      e.target.src = '/images/placeholder-house.jpg'
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-bold">{imovel.titulo}</h2>
                  <p className="mb-2 text-lg font-medium text-indigo-600">
                    R$ {imovel.preco.toLocaleString('pt-BR')}
                    {imovel.transacao_idtransacao === 2 ? '/mês' : ''}
                  </p>
                  <p className="text-sm text-gray-600">{imovel.endereco}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>{imovel.metragem}m²</span>
                    <span>{imovel.quarto} quartos</span>
                    <span>{imovel.banheiro} banheiros</span>
                    <span>{imovel.vaga} vagas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}

      <PropertyModal
        isOpen={selectedProperty !== null}
        onClose={handleCloseModal}
        propertyId={selectedProperty}
      />
    </div>
  )
}
