'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SortFilterProps {
  onSortChange: (sortBy: string, sortOrder: string) => void
}

export default function SortFilter({ onSortChange }: SortFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedSort, setSelectedSort] = useState('default')

  useEffect(() => {
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy && sortOrder) {
      setSelectedSort(`${sortBy}-${sortOrder}`)
    } else {
      setSelectedSort('default')
    }
  }, [searchParams])

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedSort(value)

    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    if (value === 'default') {
      current.delete('sortBy')
      current.delete('sortOrder')
      onSortChange('', '')
    } else {
      const [sortBy, sortOrder] = value.split('-')
      current.set('sortBy', sortBy)
      current.set('sortOrder', sortOrder)
      onSortChange(sortBy, sortOrder)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  return (
    <div className="relative">
      <select
        id="sort"
        value={selectedSort}
        onChange={handleSortChange}
        className="appearance-none w-full md:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:bg-gray-50"
      >
        <option value="default">Ordenar por mais recentes</option>
        <option value="price-asc">Preço: Menor para maior</option>
        <option value="price-desc">Preço: Maior para menor</option>
        <option value="name-asc">Nome: A-Z</option>
        <option value="name-desc">Nome: Z-A</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
