import { Module } from '@nestjs/common';
import AccountService from '@services/account/account.service';
import AccountController from '@controllers/account/account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import Account, { AccountSchema } from '@models/account.entity';
import User, { UserSchema } from '@models/user.entity';
import { AccountMongoRepository } from '@repositories/account/account-repository-mongo';
import { MongoRepository } from '@repositories/user/user-repository-mongo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountMongoRepository, MongoRepository],
  exports: [AccountService],
})
export default class AccountModule {}
