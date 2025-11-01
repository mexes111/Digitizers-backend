import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { FirebaseAdminService } from './auth/firebase-admin.service';
import { UsersController } from './controller/users.controller';
import { JobsController } from './controller/jobs.controller';
import { ApplicationsController } from './controller/applications.controller';
import { ProfilesController } from './controller/profiles.controller';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UsersController, ProfilesController, JobsController, ApplicationsController],
  providers: [PrismaService, FirebaseAdminService],
})
export class AppModule {}
