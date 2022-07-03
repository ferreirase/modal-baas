import { isValidObjectId, Types } from 'mongoose';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AccountMongoRepository } from '@repositories/account/account-repository-mongo';
import { MongoRepository } from '@repositories/user/user-repository-mongo';
import IAccountRepository from '@repositories/account/IAccount-Repositories';
import IUserRepository from '@repositories/user/IUserRepositories';
import CreateAccountDto, {
  CreateAccountResponse,
} from '@dto/account/create-account.dto';
import UpdateAccountDto, {
  UpdateAccountResponse,
} from '@dto/account/update-account.dto';
import Account from '@models/account.entity';

export interface IResponseFindAll {
  accounts: Account[];
}

@Injectable()
export default class AccountService {
  constructor(
    @Inject(AccountMongoRepository)
    private readonly accountRepository: IAccountRepository,
    @Inject(MongoRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async createAccount(
    account: CreateAccountDto,
  ): Promise<CreateAccountResponse | HttpException> {
    const userExists = await this.userRepository.findById(account.user_owner);

    if (!userExists) {
      throw new HttpException('User not found', 404);
    }

    const accountWithOwnerExists = await this.accountRepository.findByUserOwner(
      account.user_owner,
    );

    if (accountWithOwnerExists) {
      throw new HttpException('User owner already have an account!', 400);
    }

    const newAccount = await this.accountRepository.create({
      ...account,
    });

    return {
      _id: newAccount._id,
      account_number: account.number + '-' + account.digit,
    };
  }

  async updateAccount(
    accountId: Types.ObjectId,
    data: UpdateAccountDto,
  ): Promise<UpdateAccountResponse> {
    const accountExists = await this.accountRepository.findById(accountId);

    if (!accountExists) {
      throw new HttpException('Account to update not found', 404);
    }

    const accountUpdated = await this.accountRepository.update(accountId, data);

    return {
      _id: accountUpdated._id,
      number_account: accountUpdated.number + '-' + accountUpdated.digit,
    };
  }

  async findAll(): Promise<IResponseFindAll> {
    const accounts = await this.accountRepository.findAll();

    return { accounts };
  }

  async findByNumber(number: string): Promise<Account> {
    const account_digit = Number(number.split('-')[1]);

    if (!account_digit) {
      throw new HttpException('Account digit not informed', 401);
    }

    const accountExists = await this.accountRepository.findByNumber(number);

    if (!accountExists) {
      throw new HttpException('Account not found', 404);
    }

    return accountExists;
  }

  async findById(id: Types.ObjectId): Promise<Account> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Account ID is not valid', 400);
    }

    return await this.accountRepository.findById(id);
  }
}
