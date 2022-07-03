import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { TransactionStatus } from '@models/transaction.entity';

export default class UpdateTransactionDto {
  @Prop()
  @IsNotEmpty()
  status?: TransactionStatus;

  constructor(transaction?: Partial<UpdateTransactionDto>) {
    this.status = transaction.status;
  }
}
