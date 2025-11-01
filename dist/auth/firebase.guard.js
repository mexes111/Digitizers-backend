"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const firebase_admin_service_1 = require("./firebase-admin.service");
let FirebaseAuthGuard = class FirebaseAuthGuard {
    constructor(prisma, fb) {
        this.prisma = prisma;
        this.fb = fb;
    }
    async canActivate(ctx) {
        var _a, _b, _c;
        const req = ctx.switchToHttp().getRequest();
        const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token)
            throw new common_1.UnauthorizedException('Missing Bearer token');
        const decoded = await this.fb.verifyIdToken(token).catch(() => {
            throw new common_1.UnauthorizedException('Invalid token');
        });
        const email = (_b = decoded.email) !== null && _b !== void 0 ? _b : `${decoded.uid}@users.firebase`;
        const displayName = (_c = decoded.name) !== null && _c !== void 0 ? _c : 'New User';
        const user = await this.prisma.user.upsert({
            where: { firebaseUid: decoded.uid },
            create: { firebaseUid: decoded.uid, email, displayName },
            update: { email, displayName },
        });
        req.user = { id: user.id, role: user.role, email: user.email };
        return true;
    }
};
exports.FirebaseAuthGuard = FirebaseAuthGuard;
exports.FirebaseAuthGuard = FirebaseAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, firebase_admin_service_1.FirebaseAdminService])
], FirebaseAuthGuard);
//# sourceMappingURL=firebase.guard.js.map