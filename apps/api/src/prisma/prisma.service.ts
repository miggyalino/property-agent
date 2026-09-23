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

    // Enable SQLite optimizations for in-memory database
    await this.$queryRawUnsafe('PRAGMA journal_mode = MEMORY');
    await this.$queryRawUnsafe('PRAGMA synchronous = OFF');
    await this.$queryRawUnsafe('PRAGMA foreign_keys = ON');
    await this.initializeSchema();
    this.logger.log('In-memory database schema initialized');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async initializeSchema() {
    const { execSync } = await import('child_process');

    try {
      execSync('bunx prisma db push --skip-generate --accept-data-loss', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    } catch (error) {
      this.logger.warn(`Schema initialization warning: ${error.message}`);
    }
  }
}
