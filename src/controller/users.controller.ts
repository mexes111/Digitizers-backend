import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { PrismaService } from '../prisma.service';

@Controller()
export class UsersController {
  constructor(private prisma: PrismaService) {}
  @Get('health') health() { return { ok: true }; }
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Req() req: any) { const user = await this.prisma.user.findUnique({ where: { id: req.user.id } }); return user; }
}
