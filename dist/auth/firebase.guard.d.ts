import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseAdminService } from './firebase-admin.service';
export declare class FirebaseAuthGuard implements CanActivate {
    private prisma;
    private fb;
    constructor(prisma: PrismaService, fb: FirebaseAdminService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=firebase.guard.d.ts.map