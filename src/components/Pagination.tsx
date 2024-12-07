'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  // Add first page and ellipsis
  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) {
      pages.push('...')
    }
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add last page and ellipsis
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...')
    }
    pages.push(totalPages)
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
          ${currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
          }`}
      >
        Anterior
      </button>

      <div className="flex gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === currentPage}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : page === '...'
                ? 'cursor-default'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
          ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
          }`}
      >
        Próxima
      </button>
    </div>
  )
}
