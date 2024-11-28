'use client'

import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'

interface PropertyModalProps {
  isOpen: boolean
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
  galeria: Array<{
    imagem: string
    posicao: number
  }>
}

const PropertyModal = ({ isOpen, onClose, propertyId }: PropertyModalProps) => {
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState('')

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
      if (!response.ok) throw new Error('Falha ao carregar detalhes do imóvel')
      const data = await response.json()
      setProperty(data)
    } catch (err) {
      setError('Erro ao carregar detalhes do imóvel')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (idimovel: number, imagem: string | null) => {
    if (!imagem) return '/images/placeholder-house.jpg'
    return `https://adminmediaplus1.websiteseguro.com/projetos/telinveste/uploads/galeriaimovel_imagem/${idimovel}/${imagem}`
  }

  const nextImage = () => {
    if (property?.galeria) {
      setCurrentImageIndex((prev) =>
        prev === property.galeria.length - 1 ? 0 : prev + 1
      )
    }
  }

  const previousImage = () => {
    if (property?.galeria) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.galeria.length - 1 : prev - 1
      )
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {loading ? (
                    <div className="flex h-96 items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
                    </div>
                  ) : error ? (
                    <div className="flex h-96 items-center justify-center text-red-600">
                      {error}
                    </div>
                  ) : property ? (
                    <div className="flex flex-col lg:flex-row">
                      {/* Image gallery */}
                      <div className="relative lg:w-2/3">
                        <div className="relative h-96 lg:h-[600px]">
                          {property.galeria?.length > 0 ? (
                            <>
                              <Image
                                src={getImageUrl(
                                  property.idimovel,
                                  property.galeria[currentImageIndex].imagem
                                )}
                                alt={`${property.titulo} - Imagem ${currentImageIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 66vw"
                              />
                              {/* Navigation arrows */}
                              <button
                                onClick={previousImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                              >
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                              >
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                              {/* Image counter */}
                              <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                                {currentImageIndex + 1} / {property.galeria.length}
                              </div>
                            </>
                          ) : (
                            <Image
                              src="/images/placeholder-house.jpg"
                              alt={property.titulo}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        {/* Thumbnail gallery */}
                        {property.galeria?.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto bg-gray-100 p-4">
                            {property.galeria.map((img, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative h-20 w-20 flex-shrink-0 ${
                                  currentImageIndex === index
                                    ? 'ring-2 ring-indigo-500'
                                    : ''
                                }`}
                              >
                                <Image
                                  src={getImageUrl(property.idimovel, img.imagem)}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Property details */}
                      <div className="bg-white p-6 lg:w-1/3">
                        <Dialog.Title
                          as="h3"
                          className="mb-2 text-2xl font-bold text-gray-900"
                        >
                          {property.titulo}
                        </Dialog.Title>
                        <p className="mb-2 text-lg font-medium text-indigo-600">
                          R$ {property.preco.toLocaleString('pt-BR')}
                          {property.transacao_idtransacao === 2 ? '/mês' : ''}
                        </p>
                        <p className="text-gray-500">{property.endereco}</p>

                        <div className="my-6 grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <span className="block text-sm text-gray-500">
                              Área
                            </span>
                            <span className="font-medium">
                              {property.metragem}m²
                            </span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <span className="block text-sm text-gray-500">
                              Quartos
                            </span>
                            <span className="font-medium">{property.quarto}</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <span className="block text-sm text-gray-500">
                              Banheiros
                            </span>
                            <span className="font-medium">
                              {property.banheiro}
                            </span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <span className="block text-sm text-gray-500">
                              Vagas
                            </span>
                            <span className="font-medium">{property.vaga}</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="mb-2 text-lg font-medium text-gray-900">
                            Descrição
                          </h4>
                          <p className="whitespace-pre-line text-gray-600">
                            {property.descricao}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            window.location.href = '/contato'
                          }}
                          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white transition-colors hover:bg-indigo-700"
                        >
                          Entrar em Contato
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PropertyModal
