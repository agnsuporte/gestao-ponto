
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const specificDate = searchParams.get('date'); 
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100); // Segurança: limite máximo

  const where: Prisma.TimeRecordWhereInput = { 
    userId: session.user.id,
  };

  // 1. Prioridade para Data Específica
  if (specificDate) {
    where.date = specificDate; 
  } 
  // 2. Se não houver data específica, tenta o filtro por Mês/Ano
  else if (month && year) {
    const m = parseInt(month);
    const y = parseInt(year);

    // Validação básica para evitar valores injetados inválidos
    if (m >= 1 && m <= 12 && y > 2020) {
      // Criamos as datas e convertemos para string ISO
      // .toISOString() gera algo como "2024-03-01T00:00:00.000Z"
      const startDate = new Date(y, m - 1, 1).toISOString();
      const endDate = new Date(y, m, 0, 23, 59, 59, 999).toISOString();

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    
  }  
  
  const records = await prisma.timeRecord.findMany({
    where,
    orderBy: { date: 'desc' },
    take: limit,
  });

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data: Prisma.TimeRecordCreateInput = {
      ...body,
      user: { connect: { id: session.user.id } },
    };
    const record = await prisma.timeRecord.create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


