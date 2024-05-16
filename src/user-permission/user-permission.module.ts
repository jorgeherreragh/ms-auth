import { Module } from '@nestjs/common';
import { UserPermissionController } from './user-permission.controller';
import { UserPermissionService } from './user-permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermissions, UserPermissionsEntity } from './entity/user-permission.entity';

@Module({
  controllers: [UserPermissionController],
  imports: [
    MongooseModule.forFeature([{
      name: UserPermissions.name,
      schema: UserPermissionsEntity,
    }])
  ],
  providers: [UserPermissionService]
})
export class UserPermissionModule { }
