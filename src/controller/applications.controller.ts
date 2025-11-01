import { Controller, Get, Post, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private prisma: PrismaService) {}

  @Roles('TALENT')
  @Post('jobs/:id/apply')
  async apply(@Req() req: any, @Param('id') jobId: string, @Body() body: any) {
    const { coverLetter } = body || {};
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new ForbiddenException('Job not found');
    if (job.createdById === req.user.id) throw new ForbiddenException('Cannot apply to your own job');

    return this.prisma.application.create({
      data: {
        jobId,
        applicantId: req.user.id,
        coverLetter,
        status: 'APPLIED' as ApplicationStatus,
      },
    });
  }

  @Roles('TALENT')
  @Get('applications/mine')
  async myApplications(@Req() req: any) {
    return this.prisma.application.findMany({
      where: { applicantId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { job: true },
    });
  }

  @Roles('HUNTER')
  @Get('applications/received')
  async received(@Req() req: any) {
    return this.prisma.application.findMany({
      where: { job: { createdById: req.user.id } },
      orderBy: { createdAt: 'desc' },
      include: { job: true, applicant: true },
    });
  }
}
