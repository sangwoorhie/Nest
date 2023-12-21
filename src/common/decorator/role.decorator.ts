import { SetMetadata } from '@nestjs/common';
import { UserRole } from './../../user/enum/user.enum';

// 메타데이터로 유저 역할(role)권한부여
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
