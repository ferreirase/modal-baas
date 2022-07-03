import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type AccountDocument = Account & Document;

export interface IAccount extends Document {
  _id: string;
  number: string;
  digit: number;
  balance: number;
  user_owner: Types.ObjectId;
}

@Schema()
export default class Account {
  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  @ApiProperty()
  _id: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  number: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  digit: number;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  balance: number;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  @IsNotEmpty()
  @ApiProperty()
  user_owner: Types.ObjectId;

  constructor(account?: Partial<Account>) {
    this._id = account._id;
    this.number = account.number;
    this.digit = account.digit;
    this.balance = account.balance;
    this.user_owner = account.user_owner;
  }
}

export const AccountSchema = SchemaFactory.createForClass(Account);
