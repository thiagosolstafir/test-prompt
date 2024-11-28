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

    // Get property details
    const [rows] = await connection.execute(
      `SELECT i.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', g.idgaleriaimovel,
            'imagem', g.imagem
          )
        ) 
        FROM galeriaimovel g 
        WHERE g.imovel_idimovel = i.idimovel
        ) as imagens
       FROM imovel i 
       WHERE i.idimovel = ?`,
      [id]
    )

    if (!rows || (rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      )
    }

    const imovel = (rows as any[])[0]
    imovel.imagens = JSON.parse(imovel.imagens || '[]')

    // Add cache headers
    return NextResponse.json(imovel, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error: any) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  } finally {
    await closeDb(connection)
  }
}
