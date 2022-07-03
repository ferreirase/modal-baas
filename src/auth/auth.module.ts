import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserModule from '@modules/user/user.module';
import { AuthService } from './auth.service';
import UserService from '@services/user/user.service';
import AccountService from '@services/account/account.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from '@models/user.entity';
import Account, { AccountSchema } from '@models/account.entity';
import { MongoRepository } from '@repositories/user/user-repository-mongo';
import { AccountMongoRepository } from '@repositories/account/account-repository-mongo';
import AccountModule from '@modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AccountModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
    AccountService,
    MongoRepository,
    AccountMongoRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
