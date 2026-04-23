import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { parseTimeRecordInput, withCalculatedTotals } from '@/lib/time-record';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipado como Promise
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params; 
    const existingRecord = await prisma.timeRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: 'Registo não encontrado' }, { status: 404 });
    }

    if (existingRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const input = parseTimeRecordInput(await request.json());

    if (input.date && input.date !== existingRecord.date) {
      const conflictingRecord = await prisma.timeRecord.findFirst({
        where: {
          userId: session.user.id,
          date: input.date,
          NOT: { id },
        },
      });

      if (conflictingRecord) {
        return NextResponse.json({ error: 'Já existe um registo para essa data' }, { status: 409 });
      }
    }

    const data: Prisma.TimeRecordUpdateInput = {
      ...input,
      ...withCalculatedTotals({
        ...existingRecord,
        ...input,
      }),
    };

    const record = await prisma.timeRecord.update({
      where: { id },
      data,
    });

    return NextResponse.json(record);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipado como Promise
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params; 
    const existingRecord = await prisma.timeRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: 'Registo não encontrado' }, { status: 404 });
    }

    if (existingRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    await prisma.timeRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
