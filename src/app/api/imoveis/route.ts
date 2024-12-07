import { NextResponse } from 'next/server'
import { connectDb, closeDb } from '@/lib/mysql'

export async function GET(request: Request) {
  const connection = await connectDb()

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = 9

    // Simple query with pagination
    const query = `
      SELECT i.*, 
        (SELECT g.imagem FROM galeriaimovel g WHERE g.imovel_idimovel = i.idimovel LIMIT 1) as imagem
      FROM imovel i
      ORDER BY i.idimovel DESC
      LIMIT ? OFFSET ?
    `
    const offset = (page - 1) * perPage

    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM imovel')
    const total = (countResult as any[])[0].total

    // Get paginated results
    const [rows] = await connection.execute(query, [perPage, offset])

    const totalPages = Math.ceil(total / perPage)

    // Validate page number
    if (page < 1 || (page > totalPages && totalPages > 0)) {
      return NextResponse.json(
        { error: 'Invalid page number' },
        { status: 400 }
      )
    }

    // Format the response data
    const formattedRows = (rows as any[]).map(item => ({
      ...item,
      preco: parseFloat(item.preco),
      metragem: parseFloat(item.metragem),
      quarto: parseInt(item.quarto),
      banheiro: parseInt(item.banheiro),
      vaga: parseInt(item.vaga)
    }))

    return NextResponse.json({
      items: formattedRows,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage
      }
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await closeDb(connection)
  }
}
