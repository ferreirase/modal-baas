import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  HttpException,
  Param,
} from '@nestjs/common';
import { JoiValidationPipe } from '@shared/validations/validation.pipe';
import { CreateTransactionSchema } from '@shared/validations/transaction-validation-schema';
import Transaction from '@models/transaction.entity';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateTransactionDto from '@dto/transaction/create-transaction.dto';
import { Public } from '@auth/decorators/isPublic';
import TransactionService from '@services/transaction/transaction.service';
import { Types } from 'mongoose';
import { IResponseCreatedTransaction } from '@repositories/transaction/transaction-repository-mongo';

@ApiTags('transactions')
@Controller()
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiResponse({
    type: Transaction,
    description: 'New transaction created successfully',
  })
  @Post('/transactions')
  @ApiParam({
    name: 'amount',
    required: true,
    description: 'Amount of transaction',
    type: String,
  })
  @ApiParam({
    name: 'to_account',
    required: true,
    description: 'Destination account of transaction',
    type: String,
  })
  @ApiParam({
    name: 'from_account',
    required: true,
    description: 'Origin account of transaction',
    type: String,
  })
  @UsePipes(new JoiValidationPipe(CreateTransactionSchema))
  async createTransaction(
    @Body() body: CreateTransactionDto,
  ): Promise<IResponseCreatedTransaction | HttpException> {
    const transaction = await this.transactionService.createTransaction(body);

    return transaction;
  }

  @ApiResponse({ type: [Transaction], description: 'All transactions created' })
  @Public()
  @Get('/transactions')
  async findAll(): Promise<{ transactions: Array<Transaction> }> {
    return await this.transactionService.findAll();
  }

  @ApiResponse({ type: Transaction, description: 'Transaction selected by ID' })
  @Public()
  @Get('/transactions/:id')
  async findById(
    @Param('id') id: Types.ObjectId,
  ): Promise<{ transaction: Transaction } | HttpException> {
    return await this.transactionService.findById(id);
  }
}
