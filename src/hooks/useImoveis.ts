import useSWR from 'swr'

interface Property {
  idimovel: number
  titulo: string
  descricao: string
  preco: number
  endereco: string
  imagem: string
  transacao_idtransacao: string
  tipo_transacao: string
  metragem: number
  quarto: number
  banheiro: number
  vaga: number
}

interface PaginationData {
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}

interface ApiResponse {
  items: Property[]
  pagination: PaginationData
}

interface UseImoveisProps {
  page?: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('Failed to fetch data')
    error.message = await res.text()
    throw error
  }
  return res.json()
}

export function useImoveis({
  page = 1,
}: UseImoveisProps = {}) {
  const { data, error } = useSWR<ApiResponse>(
    `/api/imoveis?page=${page}`,
    fetcher
  )

  return {
    data,
    isLoading: !error && !data,
    error
  }
}

export function useImovel(id: number | null) {
  const { data, error } = useSWR<Property>(
    id ? `/api/imoveis/${id}` : null,
    fetcher
  )

  return {
    property: data,
    isLoading: !error && !data,
    error
  }
}
