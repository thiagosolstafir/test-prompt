import { NextRequest, NextResponse } from 'next/server'
import { connectDb, closeDb } from '@/lib/mysql'
import { revalidatePath } from 'next/cache'

export const revalidate = 300 // Revalidar a cada 5 minutos

export async function GET(request: NextRequest) {
  const connection = await connectDb()

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const transactionType = searchParams.get('tipo')
    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereClause = '1 = 1'
    const queryParams: any[] = []
    
    if (transactionType) {
      whereClause += ' AND i.transacao_idtransacao = ?'
      queryParams.push(transactionType)
    }

    // Get total count first with filters
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM imovel i WHERE ${whereClause}`,
      queryParams
    )
    const total = (countResult as any)[0].total
    const totalPages = Math.ceil(total / limit)

    // Validate page number
    if (page < 1 || page > totalPages) {
      return NextResponse.json(
        { error: 'Página inválida', details: `Página deve estar entre 1 e ${totalPages}` },
        { status: 400 }
      )
    }

    // Get properties with images and filters
    const [rows] = await connection.execute(
      `SELECT i.*, 
        (SELECT g.imagem FROM galeriaimovel g WHERE g.imovel_idimovel = i.idimovel LIMIT 1) as imagem
       FROM imovel i 
       WHERE ${whereClause}
       ORDER BY i.idimovel DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    )

    // Format response
    const response = {
      items: rows,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    }

    // Add cache headers
    return NextResponse.json(response, {
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
