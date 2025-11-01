import { PrismaService } from './prisma.service';
export declare class UsersController {
    private prisma;
    constructor(prisma: PrismaService);
    health(): {
        ok: boolean;
    };
    me(req: any): Promise<{
        id: string;
        firebaseUid: string;
        email: string;
        displayName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map