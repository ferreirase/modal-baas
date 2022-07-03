import { Injectable } from '@nestjs/common';
import Account, { AccountDocument } from '@models/account.entity';
import CreateAccountDto, {
  CreateAccountResponse,
} from '@dto/account/create-account.dto';
import UpdateAccountDto from '@dto/account/update-account.dto';
import { Model, Types } from 'mongoose';
import IAccountRepository from '@repositories/account/IAccount-Repositories';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AccountMongoRepository implements IAccountRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(account: CreateAccountDto): Promise<CreateAccountResponse> {
    const accountCreated = await this.accountModel.create({
      ...account,
      _id: `${new Types.ObjectId()}`,
    });

    return {
      _id: accountCreated._id,
      account_number: accountCreated.number + '-' + accountCreated.digit,
    };
  }

  async update(
    accountId: Types.ObjectId,
    data: UpdateAccountDto,
  ): Promise<Account> {
    const userUpdated = await this.accountModel.findOneAndUpdate(
      { _id: accountId },
      data,
      {
        new: true,
      },
    );

    return userUpdated;
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
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

  async findByUserOwner(userOwnerId: Types.ObjectId): Promise<Account> {
    const account = await this.accountModel.findOne({
      user_owner: userOwnerId,
    });

    return account;
  }

  async findById(accountId: Types.ObjectId): Promise<Account> {
    const account = await this.accountModel
      .findOne({
        _id: accountId,
      })
      .exec();

    return account;
  }
}
