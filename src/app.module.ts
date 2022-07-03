import { Module } from '@nestjs/common';
import UserController from '@controllers/user/user.controller';
import AccountController from '@controllers/account/account.controller';
import TransactionController from '@controllers/transaction/transaction.controller';
import { AuthController } from '@auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import UserModule from '@modules/user/user.module';
import AccountModule from '@modules/account/account.module';
import TransactionModule from '@modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      auth: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
      },
    }),
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [
    AuthController,
    UserController,
    AccountController,
    TransactionController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
