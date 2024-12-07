'use client'

interface TypeFilterProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTypeChange('')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          selectedType === ''
            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
        }`}
      >
        Todos os imóveis
      </button>
      <button
        onClick={() => onTypeChange('1')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          selectedType === '1'
            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
        }`}
      >
        Para alugar
      </button>
      <button
        onClick={() => onTypeChange('2')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          selectedType === '2'
            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200'
        }`}
      >
        Para comprar
      </button>
    </div>
  )
}
