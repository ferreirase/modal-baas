import CreateTransactionDto from '@dto/transaction/create-transaction.dto';
import UpdateTransactionDto from '@dto/transaction/update-transaction.dto';
import Transaction from '@models/transaction.entity';
import { Types } from 'mongoose';
import { IResponseCreatedTransaction } from './transaction-repository-mongo';
export default interface ITransactionRepository {
  create: (
    transaction: CreateTransactionDto,
  ) => Promise<IResponseCreatedTransaction>;
  update: (
    transactionId: Types.ObjectId,
    data: UpdateTransactionDto,
  ) => Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(transactionId: Types.ObjectId): Promise<Transaction>;
}
