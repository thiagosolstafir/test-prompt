'use client'

import { useState } from 'react'

interface Quote {
  id: number
  text: string
  ruleNumber: number
  attribution: string
  imageUrl?: string
}

const defaultQuotes: Quote[] = [
  {
    id: 1,
    text: "Nunca é tarde demais para ser quem você poderia ter sido",
    ruleNumber: 1,
    attribution: "mente digna",
    imageUrl: "https://picsum.photos/seed/quote1/1080/1080"
  },
  {
    id: 2,
    text: "Acredite em você mesmo e tudo será possivel",
    ruleNumber: 2,
    attribution: "mente digna",
    imageUrl: "https://picsum.photos/seed/quote2/1080/1080"
  },
  {
    id: 3,
    text: "Se você não puder fazer algo, você não deveria tentar",
    ruleNumber: 3,
    attribution: "mente digna",
    imageUrl: "https://picsum.photos/seed/quote3/1080/1080"
  },
  {
    id: 4,
    text: "Nunca deixe que o medo domine você",
    ruleNumber: 4,
    attribution: "mente digna",
    imageUrl: "https://picsum.photos/seed/quote4/1080/1080"
  },
  {
    id: 5,
    text: "Seja a mudança que você quer ver no mundo",
    ruleNumber: 5,
    attribution: "mente digna",
    imageUrl: "https://picsum.photos/seed/quote5/1080/1080"
  }
]

export function useQuotes() {
  const [quotes] = useState<Quote[]>(defaultQuotes)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
  }

  const previousQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  return {
    quotes,
    currentQuote: quotes[currentQuoteIndex],
    nextQuote,
    previousQuote,
    totalQuotes: quotes.length
  }
}
