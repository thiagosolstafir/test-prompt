'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Image, Mail, Phone, Building2 } from 'lucide-react'

interface NavigationProps {
  link?: any
}

export default function Navigation({ link }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-gray-800">
            Mente Digna
          </Link>
          
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/') ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Link>
            
            <Link
              href="/imoveis"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/imoveis') ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>Imóveis</span>
            </Link>
            
            <Link
              href="/contato"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/contato') ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Phone className="w-4 h-4" />
              <span>Contato</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
