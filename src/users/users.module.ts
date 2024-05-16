import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCredentials, UserCredentialsEntity } from 'src/user-credentials/entity/user-credentials.entity';
import { UserRole, UserRoleEntity } from 'src/user-role/entity/user-role.entity';
import { UserPermissions, UserPermissionsEntity } from 'src/user-permission/entity/user-permission.entity';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { AuthCodeService } from 'src/auth-code/auth-code.service';
import { AuthCode, AuthCodeEntity } from 'src/auth-code/entity/auth-code.entity';
import { RefreshToken } from 'src/auth-code/entity/refresh-token.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserEntity,
        },
        {
            name: UserCredentials.name,
            schema: UserCredentialsEntity,
        },
        {
            name: UserRole.name,
            schema: UserRoleEntity,
        },
        {
            name: UserPermissions.name,
            schema: UserPermissionsEntity,
        },
        {
            name: AuthCode.name,
            schema: AuthCodeEntity,
        }])
    ],
    providers: [UsersService, UserCredentialsService, AuthCodeService],
    controllers: [UsersController]
})
export class UsersModule { }
