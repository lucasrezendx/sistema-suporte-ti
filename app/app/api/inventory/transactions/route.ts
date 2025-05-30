export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TransactionType } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, type, quantity, recipient, notes } = body;

    if (!itemId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Calculate new quantity
    const newQuantity = type === TransactionType.IN
      ? item.quantity + quantity
      : item.quantity - quantity;

    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Create transaction and update item quantity in a transaction
    const result = await prisma.$transaction([
      prisma.inventoryTransaction.create({
        data: {
          itemId,
          type,
          quantity,
          recipient,
          notes
        }
      }),
      prisma.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      })
    ]);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory transaction' },
      { status: 500 }
    );
  }
}