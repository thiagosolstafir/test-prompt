import useSWR from 'swr'

interface Imovel {
  idimovel: number
  titulo: string
  descricao: string
  preco: number
  endereco: string
  imagem: string
  tipo: string
  metragem: number
  quarto: number
  banheiro: number
  vaga: number
  transacao_idtransacao: number
}

interface PaginationData {
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}

interface ApiResponse {
  items: Imovel[]
  pagination: PaginationData
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Falha ao carregar imóveis')
  }
  return res.json()
}

export function useImoveis(page: number, tipo?: string) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(tipo && { tipo }),
  })

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    `/api/imoveis?${queryParams}`,
    fetcher,
    {
      revalidateOnFocus: false, // Não revalidar quando a janela ganhar foco
      revalidateOnReconnect: true, // Revalidar quando reconectar à internet
      refreshInterval: 300000, // Revalidar a cada 5 minutos
      dedupingInterval: 30000, // Deduplicar requisições em um intervalo de 30 segundos
    }
  )

  return {
    imoveis: data?.items ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useImovel(id: number | null) {
  const { data, error, isLoading } = useSWR<Imovel>(
    id ? `/api/imoveis/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000, // Cache por 1 minuto
    }
  )

  return {
    imovel: data,
    isLoading,
    isError: error,
  }
}
