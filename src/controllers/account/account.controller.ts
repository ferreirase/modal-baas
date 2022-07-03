import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  HttpException,
  Param,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JoiValidationPipe } from '@shared/validations/validation.pipe';
import { CreateAccountSchema } from '@shared/validations/account-validations-schema';
import Account from '@models/account.entity';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateAccountDto, {
  CreateAccountResponse,
} from '@dto/account/create-account.dto';
import { Public } from '@auth/decorators/isPublic';
import AccountService, {
  IResponseFindAll,
} from '@services/account/account.service';

@ApiTags('accounts')
@Controller()
export default class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiResponse({
    type: Account,
    description: 'New account created successfully',
  })
  @Public()
  @Post('/accounts')
  @ApiParam({
    name: 'user_owner',
    required: true,
    description: 'User ID that owns the account',
    type: Number,
  })
  @ApiParam({
    name: 'balance',
    required: true,
    description: 'Balance of account',
    type: Number,
  })
  @ApiParam({
    name: 'digit',
    required: true,
    description: 'Digit of account',
    type: String,
  })
  @ApiParam({
    name: 'number',
    required: true,
    description: 'Number of account',
    type: String,
  })
  @UsePipes(new JoiValidationPipe(CreateAccountSchema))
  async createAccount(
    @Body() body: CreateAccountDto,
  ): Promise<CreateAccountResponse | HttpException> {
    return await this.accountService.createAccount(body);
  }

  @ApiResponse({ type: [Account], description: 'All accounts created' })
  @Public()
  @Get('/accounts')
  async findAll(): Promise<IResponseFindAll> {
    return await this.accountService.findAll();
  }

  @ApiResponse({ type: Account, description: 'Account selected by Number' })
  @Public()
  @Get('/accounts/number/:number')
  async findByNumber(@Param('number') number: string): Promise<Account> {
    return await this.accountService.findByNumber(number);
  }

  @ApiResponse({ type: Account, description: 'Account selected by ID' })
  @Get('/accounts/id/:id')
  async findById(@Param('id') id: Types.ObjectId): Promise<Account> {
    return await this.accountService.findById(id);
  }

  @ApiResponse({
    type: Account,
    description: 'Account Balance selected by ID',
  })
  @Get('/accounts/:id/balance')
  async getBalanceByAccount(@Param('id') id: Types.ObjectId): Promise<{
    _id: string;
    balance: number;
  }> {
    const accountExists = await this.accountService.findById(id);

    return {
      _id: accountExists._id.toString(),
      balance: accountExists.balance,
    };
  }
}
