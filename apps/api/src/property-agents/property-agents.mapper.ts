import { Prisma } from '@prisma/client';

export const propertyAgentSummarySelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  mobileNumber: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PropertyAgentSelect;

export const propertyAgentDetailSelect = {
  ...propertyAgentSummarySelect,
  properties: {
    select: {
      id: true,
      address: true,
      createdAt: true,
    },
  },
  notes: {
    select: {
      id: true,
      title: true,
      content: true,
      type: true,
      dueDate: true,
      completed: true,
      propertyId: true,
    },
  },
} satisfies Prisma.PropertyAgentSelect;

type PropertyAgentSummaryRow = Prisma.PropertyAgentGetPayload<{
  select: typeof propertyAgentSummarySelect;
}>;

type PropertyAgentDetailRow = Prisma.PropertyAgentGetPayload<{
  select: typeof propertyAgentDetailSelect;
}>;

export interface PropertyAgentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyAgentDetailResponse extends PropertyAgentResponse {
  properties: Array<{ id: string; address: string; createdAt: string }>;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    dueDate: string | null;
    completed: boolean;
    propertyId: string | null;
  }>;
}

export const toPropertyAgentResponse = (
  row: PropertyAgentSummaryRow,
): PropertyAgentResponse => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  email: row.email,
  mobileNumber: row.mobileNumber,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

export const toPropertyAgentDetailResponse = (
  row: PropertyAgentDetailRow,
): PropertyAgentDetailResponse => ({
  ...toPropertyAgentResponse(row),
  properties: row.properties.map((property) => ({
    id: property.id,
    address: property.address,
    createdAt: property.createdAt.toISOString(),
  })),
  notes: row.notes.map((note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    type: note.type,
    dueDate: note.dueDate?.toISOString() ?? null,
    completed: note.completed,
    propertyId: note.propertyId,
  })),
});
