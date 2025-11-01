import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('q') q?: string, @Query('status') status?: JobStatus) {
    return this.prisma.job.findMany({
      where: {
        status: status ?? 'OPEN',
        ...(q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ]
        } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  @Roles('HUNTER')
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const { title, description, budgetMin, budgetMax, currency, location, status } = body || {};
    return this.prisma.job.create({
      data: {
        title,
        description,
        budgetMin, budgetMax, currency, location,
        status: (status ?? 'OPEN') as JobStatus,
        createdById: req.user.id,
      },
    });
  }
}
