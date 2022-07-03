import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { TransactionStatus } from '@models/transaction.entity';

export default class CreateTransactionDto {
  @Prop()
  @IsNotEmpty()
  amount: number;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @IsNotEmpty()
  status?: TransactionStatus;

  @Prop({ type: Types.ObjectId, ref: 'account' })
  @IsNotEmpty()
  from_account: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'account' })
  @IsNotEmpty()
  to_account: Types.ObjectId;

  constructor(transaction?: Partial<CreateTransactionDto>) {
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.from_account = transaction.from_account;
    this.to_account = transaction.to_account;
  }
}
