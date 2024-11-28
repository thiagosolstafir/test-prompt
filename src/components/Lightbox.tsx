'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  currentImage: {
    url: string
    text: string
    ruleNumber: number
    attribution: string
  }
  onNext: () => void
  onPrevious: () => void
}

export default function Lightbox({ isOpen, onClose, currentImage, onNext, onPrevious }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrevious()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, onNext, onPrevious])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl aspect-square mx-4">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full">
          <Image
            src={currentImage.url}
            alt={`Citação ${currentImage.ruleNumber}`}
            fill
            className="object-contain"
            priority
          />
          
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-white/90 text-sm font-medium mb-2">
              REGRA Nº {currentImage.ruleNumber}
            </p>
            <p className="text-white text-xl md:text-2xl font-bold mb-2">
              {currentImage.text}
            </p>
            <p className="text-white/70 text-sm">
              @{currentImage.attribution}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
