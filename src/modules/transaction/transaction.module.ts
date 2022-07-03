import { Module } from '@nestjs/common';
import TransactionController from '@controllers/transaction/transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import Account, { AccountSchema } from '@models/account.entity';
import Transaction, { TransactionSchema } from '@models/transaction.entity';
import { AccountMongoRepository } from '@repositories/account/account-repository-mongo';
import { TransactionMongoRepository } from '@repositories/transaction/transaction-repository-mongo';
import TransactionService from '@services/transaction/transaction.service';
import AccountModule from '@modules/account/account.module';

@Module({
  imports: [
    AccountModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionMongoRepository,
    AccountMongoRepository,
  ],
  exports: [TransactionService],
})
export default class TransactionModule {}
