import { NextRequest, NextResponse } from 'next/server'
import { connectDb, closeDb } from '@/lib/mysql'

export const revalidate = 300 // Revalidar a cada 5 minutos

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const connection = await connectDb()

  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: 'ID do imóvel não fornecido' },
        { status: 400 }
      )
    }

    // Get property details
    const [rows] = await connection.execute(
      `SELECT i.*, 
        GROUP_CONCAT(
          CONCAT('{"id":', g.idgaleriaimovel, ',"imagem":"', g.imagem, '"}')
        ) as imagens
       FROM imovel i 
       LEFT JOIN galeriaimovel g ON g.imovel_idimovel = i.idimovel
       WHERE i.idimovel = ?
       GROUP BY i.idimovel`,
      [id]
    )

    if (!rows || (rows as any[]).length === 0) {
      await closeDb(connection)
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      )
    }

    const imovel = (rows as any[])[0]
    
    try {
      // Convert the GROUP_CONCAT result to a proper JSON array
      imovel.imagens = imovel.imagens 
        ? JSON.parse(`[${imovel.imagens}]`)
        : []
    } catch (jsonError) {
      console.error('Error parsing images JSON:', jsonError)
      imovel.imagens = []
    }

    await closeDb(connection)

    // Add cache headers
    return NextResponse.json(imovel, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error: any) {
    console.error('Database error:', error)
    await closeDb(connection)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error.message || 'Ocorreu um erro ao buscar os dados do imóvel'
      },
      { status: 500 }
    )
  }
}
