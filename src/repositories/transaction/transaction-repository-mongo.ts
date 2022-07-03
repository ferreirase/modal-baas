import { Injectable } from '@nestjs/common';
import Account, { AccountDocument } from '@models/account.entity';
import Transaction, { TransactionDocument } from '@models/transaction.entity';
import CreateTransactionDto from '@dto/transaction/create-transaction.dto';
import UpdateTransactionDto from '@dto/transaction/update-transaction.dto';
import { Model, Types } from 'mongoose';
import ITransactionRepository from '@repositories/transaction/ITransaction-Repositories';
import { InjectModel } from '@nestjs/mongoose';

export interface IResponseCreatedTransaction {
  _id: Types.ObjectId;
  status: string;
}

@Injectable()
export class TransactionMongoRepository implements ITransactionRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    transaction: CreateTransactionDto,
  ): Promise<IResponseCreatedTransaction> {
    const transactionCreated = await this.transactionModel.create({
      ...transaction,
      _id: `${new Types.ObjectId()}`,
    });

    return {
      _id: transactionCreated._id,
      status: transactionCreated.status,
    };
  }

  async update(
    transactionId: Types.ObjectId,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transactionUdated = await this.transactionModel.findOneAndUpdate(
      { _id: transactionId },
      data,
      {
        new: true,
      },
    );

    return transactionUdated;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findByNumber(number: string): Promise<Account> {
    const account_number = number.split('-')[0];
    const account_digit = Number(number.split('-')[1]);

    const account = await this.accountModel.findOne({
      number: account_number,
      digit: account_digit,
    });

    return account;
  }

  async findByUserOwner(userOwnerId: {
    type: Types.ObjectId;
    ref: 'user';
  }): Promise<Account> {
    const account = await this.accountModel.findOne({ userOwnerId });
    return account;
  }

  async findById(transactionId: Types.ObjectId): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({
      _id: transactionId,
    });
    return transaction;
  }
}
