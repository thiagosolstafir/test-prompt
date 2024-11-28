'use client'

import Image from 'next/image'
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface QuoteCardProps {
  quote: string
  ruleNumber: number
  attribution: string
  imageUrl?: string
  onNext?: () => void
  onPrevious?: () => void
}

export default function QuoteCard({ 
  quote, 
  ruleNumber, 
  attribution, 
  imageUrl = 'https://picsum.photos/1080/1080',
  onNext,
  onPrevious
}: QuoteCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isShared, setIsShared] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Regra Nº ${ruleNumber}`,
          text: quote,
          url: window.location.href,
        })
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(`${quote} - ${attribution}`)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    }
  }

  return (
    <div className="relative w-full max-w-[1080px] aspect-square bg-black overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt="Motivational background"
        fill
        className={`
          object-cover transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        priority
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {onPrevious && (
        <button 
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button 
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      
      <div className="absolute bottom-0 w-full p-6 text-center">
        <p className="text-white/90 text-sm font-medium mb-2">
          REGRA Nº {ruleNumber}
        </p>
        <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          {quote}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-sm">@{attribution}</p>
          <button 
            className="text-white/70 hover:text-white transition-colors p-2 group relative"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            {isShared && (
              <span className="absolute -top-8 right-0 text-sm bg-white text-black px-2 py-1 rounded shadow-lg">
                Copiado!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
