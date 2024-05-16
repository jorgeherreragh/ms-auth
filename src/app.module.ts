import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UserCredentialsController } from './user-credentials/user-credentials.controller';
import { UserCredentialsModule } from './user-credentials/user-credentials.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { AuthCodeModule } from './auth-code/auth-code.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/management_dashboard'),
    UsersModule,
    UserCredentialsModule,
    UserRoleModule,
    UserPermissionModule,
    AuthCodeModule,
  ],
  controllers: [AppController, UserCredentialsController],
  providers: [AppService],
})
export class AppModule { }
