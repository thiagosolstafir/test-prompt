'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchFilterProps {
  onSearch: (query: string) => void
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (value) {
      current.set('q', value)
    } else {
      current.delete('q')
    }
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
    onSearch(value)
  }

  return (
    <div className="relative w-full md:w-96">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Buscar imóveis..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:bg-gray-50"
      />
    </div>
  )
}
