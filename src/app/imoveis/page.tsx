'use client'

import { useState } from 'react'
import { useImoveis } from '@/hooks/useImoveis'
import PropertyCard from '@/components/PropertyCard'
import PropertyModal from '@/components/PropertyModal'
import Pagination from '@/components/Pagination'

export default function Imoveis() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  const { data, error, isLoading } = useImoveis({
    page: currentPage
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Erro ao carregar os imóveis. Por favor, tente novamente.
          </div>
        ) : (
          <>
            {data?.items && data.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((property) => (
                  <PropertyCard
                    key={property.idimovel}
                    property={property}
                    onClick={() => setSelectedProperty(property.idimovel)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum imóvel encontrado
              </div>
            )}

            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={data.pagination.currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedProperty && (
        <PropertyModal
          propertyId={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </main>
  )
}
