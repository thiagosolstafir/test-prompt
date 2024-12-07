'use client'

import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useImovel } from '@/hooks/useImoveis'

interface PropertyModalProps {
  onClose: () => void
  propertyId: number | null
}

interface PropertyDetails {
  idimovel: number
  titulo: string
  descricao: string
  preco: number
  endereco: string
  tipo: string
  transacao_idtransacao: number
  metragem: number
  quarto: number
  banheiro: number
  vaga: number
  imagens: Array<{
    id: number
    imagem: string
  }>
}

const PropertyModal = ({ onClose, propertyId }: PropertyModalProps) => {
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)
  const [error, setError] = useState('')
  const isOpen = propertyId !== null

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchPropertyDetails(propertyId)
    } else {
      setProperty(null)
      setCurrentImageIndex(0)
    }
  }, [isOpen, propertyId])

  const fetchPropertyDetails = async (id: number) => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`/api/imoveis/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao carregar detalhes do imóvel')
      }

      setProperty(data)
    } catch (error: any) {
      console.error('Error fetching property details:', error)
      setError(error.message || 'Ocorreu um erro ao carregar os detalhes do imóvel. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrevImage = () => {
    setImageLoading(true)
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property?.imagens?.length || 1) - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setImageLoading(true)
    setCurrentImageIndex((prev) =>
      prev === (property?.imagens?.length || 1) - 1 ? 0 : prev + 1
    )
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const getImageUrl = (imageName: string) => {
    return `https://adminmediaplus1.websiteseguro.com/projetos/telinveste/uploads/galeriaimovel_imagem/${property?.idimovel}/${imageName}`
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 p-4">{error}</div>
                ) : property ? (
                  <div className="space-y-4">
                    <div className="aspect-w-16 aspect-h-9 relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                      {property.imagens && property.imagens.length > 0 ? (
                        <>
                          <Image
                            src={getImageUrl(property.imagens[currentImageIndex].imagem)}
                            alt={property.titulo}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={handleImageLoad}
                            onError={() => {
                              setImageLoading(false)
                              setError('Erro ao carregar a imagem')
                            }}
                          />
                          {property.imagens.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between p-4">
                              <button
                                onClick={handlePrevImage}
                                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                              >
                                ←
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                              >
                                →
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">Sem imagem disponível</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                        {property.titulo}
                      </Dialog.Title>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xl font-semibold text-gray-900">
                            R$ {property.preco.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-gray-500">{property.endereco}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Área</p>
                            <p className="font-medium">{property.metragem}m²</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Quartos</p>
                            <p className="font-medium">{property.quarto}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Banheiros</p>
                            <p className="font-medium">{property.banheiro}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Vagas</p>
                            <p className="font-medium">{property.vaga}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Descrição</h4>
                        <p className="mt-2 text-gray-500">{property.descricao}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default PropertyModal
