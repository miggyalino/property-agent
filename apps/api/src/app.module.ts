import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyAgentsModule } from './property_agents/property_agents.module';

@Module({
  imports: [PrismaModule, PropertyAgentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
