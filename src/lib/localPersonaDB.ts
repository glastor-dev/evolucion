import Dexie, { Table } from 'dexie';

export interface PersonaAssignment {
  key: string; // name__role
  productId: string;
}

class LocalPersonaDB extends Dexie {
  personaAssignments!: Table<PersonaAssignment, string>;

  constructor() {
    super('LocalPersonaDB');
    this.version(1).stores({
      personaAssignments: 'key, productId'
    });
  }
}

export const db = new LocalPersonaDB();

export async function getAssignment(key: string) {
  try { return await db.personaAssignments.get(key); } catch { return undefined; }
}

export async function setAssignments(pairs: PersonaAssignment[]) {
  try { await db.personaAssignments.bulkPut(pairs); } catch { /* no-op */ }
}

export async function getAssignmentsByProduct(productId: string) {
  try { return await db.personaAssignments.where({ productId }).toArray(); } catch { return []; }
}

export async function clearAllAssignments() {
  try { await db.personaAssignments.clear(); } catch { /* no-op */ }
}

export async function getAllAssignments(): Promise<PersonaAssignment[]> {
  try { return await db.personaAssignments.toArray(); } catch { return []; }
}
