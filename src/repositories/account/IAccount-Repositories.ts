import { Types } from 'mongoose';
import CreateAccountDto, {
  CreateAccountResponse,
} from '@dto/account/create-account.dto';
import UpdateAccountDto from '@dto/account/update-account.dto';
import Account from '@models/account.entity';

export default interface IAccountRepository {
  create: (account: CreateAccountDto) => Promise<CreateAccountResponse>;
  update: (
    accountId: Types.ObjectId,
    data: UpdateAccountDto,
  ) => Promise<Account>;
  findAll(): Promise<Account[]>;
  findByNumber(accountNumber: string): Promise<Account>;
  findById(accountId: Types.ObjectId): Promise<Account>;
  findByUserOwner(userOwnerId: Types.ObjectId): Promise<Account>;
}
