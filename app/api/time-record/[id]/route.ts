import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipado como Promise
) {
  try {
    // 1. Aguarde o desmembramento (unwrap) dos params primeiro
    const { id } = await params; 
    
    const data: Prisma.TimeRecordUpdateInput = await request.json();

    const record = await prisma.timeRecord.update({
      where: { id: id }, // Agora use o id extraído
      data,
    });

    return NextResponse.json(record);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipado como Promise
) {
  try {
    // 1. Aguarde o desmembramento (unwrap) dos params primeiro
    const { id } = await params; 
    await prisma.timeRecord.delete({ where: { id:id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
