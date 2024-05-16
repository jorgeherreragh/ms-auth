import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, UserRoleEntity } from './entity/user-role.entity';

@Module({
  controllers: [UserRoleController],
  imports: [
    MongooseModule.forFeature([{
      name: UserRole.name,
      schema: UserRoleEntity,
    }])
  ],
  providers: [UserRoleService]
})
export class UserRoleModule { }
