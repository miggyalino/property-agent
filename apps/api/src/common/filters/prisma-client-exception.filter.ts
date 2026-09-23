import {
  ArgumentsHost,
  Catch,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    switch (exception.code) {
      case 'P2002': {
        const target = exception.meta?.target;
        const fields = Array.isArray(target) ? target.join(', ') : 'value';

        return super.catch(
          new ConflictException(`A property agent with this ${fields} already exists.`),
          host,
        );
      }

      case 'P2025':
        return super.catch(new NotFoundException('Record not found.'), host);

      default:
        return super.catch(exception, host);
    }
  }
}
