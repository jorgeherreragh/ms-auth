import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCredentials, UserCredentialsEntity } from './entity/user-credentials.entity';
import { UserCredentialsController } from './user-credentials.controller';

@Module({
  providers: [UserCredentialsService],
  imports: [
    MongooseModule.forFeature([{
      name: UserCredentials.name,
      schema: UserCredentialsEntity,
    }])
  ],

  controllers: [UserCredentialsController]
})
export class UserCredentialsModule { }
