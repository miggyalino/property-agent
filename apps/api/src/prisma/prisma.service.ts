import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    await this.$queryRawUnsafe('PRAGMA journal_mode = MEMORY');
    await this.$queryRawUnsafe('PRAGMA synchronous = OFF');
    await this.$queryRawUnsafe('PRAGMA foreign_keys = ON');
    await this.initializeSchema();
    this.logger.log('In-memory database schema initialized');
    await this.seedDatabase();
    this.logger.log('Database seeded with sample data');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async initializeSchema() {
    try {
      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "property_agents" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "mobileNumber" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "properties" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "address" TEXT NOT NULL,
          "agentId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          CONSTRAINT "properties_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "property_agents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      await this.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "properties_agentId_idx" ON "properties"("agentId")
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "families" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "propertyId" TEXT NOT NULL UNIQUE,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          CONSTRAINT "families_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "tenants" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "email" TEXT,
          "phone" TEXT,
          "familyId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          CONSTRAINT "tenants_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      await this.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "tenants_familyId_idx" ON "tenants"("familyId")
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "notes" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "dueDate" DATETIME,
          "completed" INTEGER NOT NULL DEFAULT 0,
          "agentId" TEXT NOT NULL,
          "propertyId" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          CONSTRAINT "notes_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "property_agents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "notes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
        )
      `);

      await this.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "notes_agentId_idx" ON "notes"("agentId")
      `);

      await this.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "notes_propertyId_idx" ON "notes"("propertyId")
      `);
    } catch (error) {
      this.logger.error(
        `Schema initialization failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async seedDatabase() {
    try {
      this.logger.log('Seeding database with sample data');

      await this.note.deleteMany();
      await this.tenant.deleteMany();
      await this.family.deleteMany();
      await this.property.deleteMany();
      await this.propertyAgent.deleteMany();

      const agent1 = await this.propertyAgent.create({
        data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@realestate.com', mobileNumber: '+1-555-0101' },
      });
      const agent2 = await this.propertyAgent.create({
        data: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@realestate.com', mobileNumber: '+1-555-0102' },
      });
      const agent3 = await this.propertyAgent.create({
        data: { firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@realestate.com', mobileNumber: '+1-555-0103' },
      });

      const property1 = await this.property.create({
        data: {
          address: '123 Main St, Springfield, IL 62701',
          agentId: agent1.id,
          family: {
            create: {
              name: 'The Anderson Family',
              tenants: {
                create: [
                  { firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@email.com', phone: '+1-555-1001' },
                  { firstName: 'Sarah', lastName: 'Anderson', email: 'sarah.anderson@email.com', phone: '+1-555-1002' },
                ],
              },
            },
          },
        },
      });

      const property2 = await this.property.create({
        data: {
          address: '456 Oak Ave, Chicago, IL 60601',
          agentId: agent1.id,
          family: {
            create: {
              name: 'The Williams Family',
              tenants: {
                create: [
                  { firstName: 'David', lastName: 'Williams', email: 'david.williams@email.com', phone: '+1-555-2001' },
                  { firstName: 'Emily', lastName: 'Williams', email: 'emily.williams@email.com', phone: '+1-555-2002' },
                ],
              },
            },
          },
        },
      });

      const property3 = await this.property.create({
        data: {
          address: '789 Elm St, Boston, MA 02101',
          agentId: agent2.id,
          family: { create: { name: 'The Brown Family', tenants: { create: [{ firstName: 'James', lastName: 'Brown', email: 'james.brown@email.com', phone: '+1-555-3001' }] } } },
        },
      });

      await this.property.create({ data: { address: '321 Pine Rd, Seattle, WA 98101', agentId: agent2.id } });

      const property5 = await this.property.create({
        data: {
          address: '654 Maple Dr, Austin, TX 78701',
          agentId: agent3.id,
          family: {
            create: {
              name: 'The Garcia Family',
              tenants: {
                create: [
                  { firstName: 'Carlos', lastName: 'Garcia', email: 'carlos.garcia@email.com', phone: '+1-555-5001' },
                  { firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@email.com', phone: '+1-555-5002' },
                ],
              },
            },
          },
        },
      });

      await this.note.createMany({
        data: [
          { title: 'Schedule HVAC Maintenance', content: 'Annual HVAC inspection and cleaning required before summer', type: 'maintenance', dueDate: new Date('2026-05-15'), completed: false, agentId: agent1.id, propertyId: property1.id },
          { title: 'Pest Control Service', content: 'Quarterly pest control treatment scheduled', type: 'pest_control', dueDate: new Date('2026-04-10'), completed: true, agentId: agent1.id, propertyId: property1.id },
          { title: 'Roof Inspection', content: 'Check for any damage after recent storm', type: 'maintenance', dueDate: new Date('2026-04-01'), completed: false, agentId: agent1.id, propertyId: property2.id },
          { title: 'Lease Renewal Reminder', content: 'Contact Williams family about lease renewal 60 days before expiry', type: 'reminder', dueDate: new Date('2026-06-01'), completed: false, agentId: agent1.id, propertyId: property2.id },
          { title: 'Paint Exterior', content: 'Schedule exterior painting for the property', type: 'maintenance', dueDate: new Date('2026-07-15'), completed: false, agentId: agent2.id, propertyId: property3.id },
          { title: 'General Task - Market Research', content: 'Research rental rates in the area', type: 'reminder', dueDate: new Date('2026-05-10'), completed: false, agentId: agent1.id, propertyId: null },
        ],
      });

      this.logger.log('Seeded: 3 agents, 5 properties, 4 families, 7 tenants, 6 notes');
    } catch (error) {
      this.logger.warn(
        `Seeding warning: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
