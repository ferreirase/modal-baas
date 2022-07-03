import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Account from './account.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type TransactionDocument = Transaction & Document;

export interface ITransaction extends Document {
  _id: string;
  amount: number;
  status?: TransactionStatus;
  from_account: { type: ObjectId; ref: 'account' };
  to_account: { type: ObjectId; ref: 'account' };
}

@Schema()
export default class Transaction {
  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  @ApiProperty()
  _id: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @IsNotEmpty()
  @ApiProperty()
  status?: TransactionStatus;

  @Prop({ type: Types.ObjectId, ref: 'account' })
  @IsNotEmpty()
  @ApiProperty({ type: () => Account })
  from_account: { type: ObjectId; ref: 'account' };

  @Prop({ type: Types.ObjectId, ref: 'account' })
  @IsNotEmpty()
  @ApiProperty({ type: () => Account })
  to_account: { type: ObjectId; ref: 'account' };

  constructor(transaction?: Partial<Transaction>) {
    this._id = transaction._id;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.from_account = transaction.from_account;
    this.to_account = transaction.to_account;
  }
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
