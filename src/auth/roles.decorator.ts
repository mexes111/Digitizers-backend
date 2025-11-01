import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles' as const;
export type AppRole = 'TALENT' | 'HUNTER' | 'ADMIN';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
