import { Types } from 'mongoose';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  TransactionMongoRepository,
  IResponseCreatedTransaction,
} from '@repositories/transaction/transaction-repository-mongo';
import ITransactiontRepository from '@repositories/transaction/ITransaction-Repositories';
import Transaction, { TransactionStatus } from '@models/transaction.entity';
import CreateTransactionDto from '@dto/transaction/create-transaction.dto';
import AccountService from '@services/account/account.service';

@Injectable()
export default class TransactionService {
  constructor(
    @Inject(TransactionMongoRepository)
    private readonly transactionRepository: ITransactiontRepository,
    private readonly accountService: AccountService,
  ) {}

  async createTransaction(
    transaction: CreateTransactionDto,
  ): Promise<IResponseCreatedTransaction | HttpException> {
    if (transaction.from_account === transaction.to_account) {
      throw new HttpException(
        'Origin and Destination account not be the same',
        400,
      );
    }

    const fromAccountExists = await this.accountService.findById(
      transaction.from_account,
    );

    const toAccountExists = await this.accountService.findById(
      transaction.to_account,
    );

    if (!fromAccountExists) {
      throw new HttpException('Origin account not found', 404);
    }

    if (fromAccountExists.balance < transaction.amount) {
      throw new HttpException('Insufficient funds', 400);
    }

    if (!toAccountExists) {
      throw new HttpException('Destination account not found', 404);
    }

    const newTransaction = await this.transactionRepository.create({
      ...transaction,
      status: TransactionStatus.APPROVED,
    });

    await this.accountService.updateAccount(transaction.from_account, {
      balance: fromAccountExists.balance - transaction.amount,
    });

    await this.accountService.updateAccount(transaction.to_account, {
      balance: toAccountExists.balance + transaction.amount,
    });

    return newTransaction;
  }

  async findAll(): Promise<{ transactions: Transaction[] }> {
    const transactions = await this.transactionRepository.findAll();

    return { transactions };
  }

  async findById(
    id: Types.ObjectId,
  ): Promise<{ transaction: Transaction } | HttpException> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new HttpException('Transaction not found', 404);
    }

    return { transaction };
  }
}
