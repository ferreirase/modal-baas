import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export type CreateAccountResponse = {
  _id: string;
  account_number: string;
};

export default class CreateAccountDto {
  @Prop()
  @IsNotEmpty()
  number: string;

  @Prop()
  @IsNotEmpty()
  digit: number;

  @Prop()
  @IsNotEmpty()
  balance: number;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  @IsNotEmpty()
  user_owner: Types.ObjectId;

  constructor(account?: Partial<CreateAccountDto>) {
    this.number = account.number;
    this.digit = account.digit;
    this.balance = account.balance;
    this.user_owner = account.user_owner;
  }
}
