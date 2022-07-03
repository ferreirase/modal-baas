import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export type UpdateAccountResponse = {
  _id: string;
  number_account: string;
};

export default class UpdateAccountDto {
  @Prop()
  @IsNotEmpty()
  number?: string;

  @Prop()
  @IsNotEmpty()
  digit?: number;

  @Prop()
  @IsNotEmpty()
  balance?: number;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  @IsNotEmpty()
  user_owner?: Types.ObjectId;

  constructor(account?: Partial<UpdateAccountDto>) {
    this.number = account.number;
    this.digit = account.digit;
    this.balance = account.balance;
    this.user_owner = account.user_owner;
  }
}
