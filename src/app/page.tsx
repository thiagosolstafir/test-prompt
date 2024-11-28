'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuotes } from '../hooks/useQuotes'
import Lightbox from '../components/Lightbox'

export default function Gallery() {
  const { quotes } = useQuotes()
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number | null>(null)

  const handleNext = () => {
    setSelectedQuoteIndex((prev) => 
      prev !== null ? (prev + 1) % quotes.length : null
    )
  }

  const handlePrevious = () => {
    setSelectedQuoteIndex((prev) => 
      prev !== null ? (prev - 1 + quotes.length) % quotes.length : null
    )
  }

  return (
    <>
      <main className="min-h-screen pt-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Galeria de Citações</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className="relative aspect-square bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
                onClick={() => setSelectedQuoteIndex(index)}
              >
                <Image
                  src={quote.imageUrl || 'https://picsum.photos/seed/default/1080/1080'}
                  alt={`Citação ${quote.ruleNumber}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 w-full p-4 text-white">
                    <p className="text-sm font-medium mb-1">REGRA Nº {quote.ruleNumber}</p>
                    <p className="text-lg font-bold mb-2">{quote.text}</p>
                    <p className="text-sm opacity-70">@{quote.attribution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Lightbox
        isOpen={selectedQuoteIndex !== null}
        onClose={() => setSelectedQuoteIndex(null)}
        currentImage={selectedQuoteIndex !== null ? {
          url: quotes[selectedQuoteIndex].imageUrl || 'https://picsum.photos/seed/default/1080/1080',
          text: quotes[selectedQuoteIndex].text,
          ruleNumber: quotes[selectedQuoteIndex].ruleNumber,
          attribution: quotes[selectedQuoteIndex].attribution
        } : {
          url: '',
          text: '',
          ruleNumber: 0,
          attribution: ''
        }}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  )
}
