import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService, private fb: FirebaseAdminService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<any>();
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new UnauthorizedException('Missing Bearer token');

    const decoded = await this.fb.verifyIdToken(token).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    const email = (decoded as any).email ?? `${decoded.uid}@users.firebase`;
    const displayName = (decoded as any).name ?? 'New User';

    const user = await this.prisma.user.upsert({
      where: { firebaseUid: decoded.uid }, // must be unique in your schema
      create: { firebaseUid: decoded.uid, email, displayName },
      update: { email, displayName },
    });

    req.user = { id: user.id, role: user.role, email: user.email };
    return true;
  }
}
