'use client'

import Image from 'next/image'

interface Property {
  idimovel: number
  titulo: string
  descricao: string
  preco: number
  endereco: string
  imagem: string
  transacao_idtransacao: string
  metragem?: number
  quarto?: number
  banheiro?: number
  vaga?: number
}

interface PropertyCardProps {
  property: Property
  onClick: () => void
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative h-48">
        <Image
          src={property.imagem 
            ? `https://adminmediaplus1.websiteseguro.com/projetos/telinveste/uploads/galeriaimovel_imagem/${property.idimovel}/${property.imagem}`
            : '/images/placeholder-house.jpg'
          }
          alt={property.titulo}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e: any) => {
            e.target.src = '/images/placeholder-house.jpg'
          }}
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {property.titulo}
        </h2>
        
        <p className="text-lg font-medium text-primary mb-2">
          R$ {property.preco.toLocaleString('pt-BR')}
          {property.transacao_idtransacao === '1' ? '/mês' : ''}
        </p>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-1">
          {property.endereco}
        </p>
        
        {(property.metragem || property.quarto || property.banheiro || property.vaga) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {property.metragem && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.metragem}m²
              </span>
            )}
            {property.quarto && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.quarto} {property.quarto === 1 ? 'quarto' : 'quartos'}
              </span>
            )}
            {property.banheiro && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {property.banheiro} {property.banheiro === 1 ? 'banheiro' : 'banheiros'}
              </span>
            )}
            {property.vaga && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {property.vaga} {property.vaga === 1 ? 'vaga' : 'vagas'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
