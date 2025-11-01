import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async myProfile(@Req() req: any) {
    const userId = req.user.id;
    const [talent, hunter] = await Promise.all([
      this.prisma.talentProfile.findUnique({ where: { userId } }),
      this.prisma.hunterProfile.findUnique({ where: { userId } }),
    ]);
    return { role: req.user.role, talent, hunter };
  }

  @Roles('TALENT')
  @Put('talent')
  async upsertTalent(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;
    const { headline, bio, skills, location, website } = body || {};
    return this.prisma.talentProfile.upsert({
      where: { userId },
      create: { userId, headline, bio, skills: skills ?? [], location, website },
      update: { headline, bio, skills: skills ?? [], location, website },
    });
  }

  @Roles('HUNTER')
  @Put('hunter')
  async upsertHunter(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;
    const { companyName, bio, website, location } = body || {};
    return this.prisma.hunterProfile.upsert({
      where: { userId },
      create: { userId, companyName, bio, website, location },
      update: { companyName, bio, website, location },
    });
  }
}
