
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getMonthDateRange, parseTimeRecordInput, withCalculatedTotals } from '@/lib/time-record';

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
    const range = getMonthDateRange(y, m);

    if (range) {
      where.date = {
        gte: range.startDate,
        lte: range.endDate,
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
    const input = parseTimeRecordInput(await request.json());

    if (!input.date) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 });
    }

    const existingRecord = await prisma.timeRecord.findFirst({
      where: {
        userId: session.user.id,
        date: input.date,
      },
    });

    if (existingRecord) {
      const data: Prisma.TimeRecordUpdateInput = {
        ...input,
        ...withCalculatedTotals({
          ...existingRecord,
          ...input,
        }),
      };

      const record = await prisma.timeRecord.update({
        where: { id: existingRecord.id },
        data,
      });

      return NextResponse.json(record);
    }

    const data: Prisma.TimeRecordCreateInput = {
      ...input,
      ...withCalculatedTotals(input),
      user: { connect: { id: session.user.id } },
    };

    const record = await prisma.timeRecord.create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


