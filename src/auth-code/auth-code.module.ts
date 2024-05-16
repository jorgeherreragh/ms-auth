import { Module } from '@nestjs/common';
import { AuthCodeController } from './auth-code.controller';
import { AuthCodeService } from './auth-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCode, AuthCodeEntity } from './entity/auth-code.entity';
import { User, UserEntity } from 'src/users/entity/user.entity';
import { RefreshToken } from './entity/refresh-token.entity';

@Module({
  controllers: [AuthCodeController],
  imports: [
    MongooseModule.forFeature([{
      name: AuthCode.name,
      schema: AuthCodeEntity,
    },
    {
      name: User.name,
      schema: UserEntity,
    }])],
  providers: [AuthCodeService]
})
export class AuthCodeModule { }
