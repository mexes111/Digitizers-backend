import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  // Nest calls this on shutdown, so we can cleanly disconnect.
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional: if you still want to close the app when Prisma triggers beforeExit,
  // hook Node's process event instead of Prisma's $on to avoid TS issues.
  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
