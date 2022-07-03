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
import { CreateUserSchema } from '@shared/validations/user-validations-schemas';
import User from '@models/user.entity';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDTO, { CreateUserResponse } from '@dto/user/create-user.dto';
import { Public } from '@auth/decorators/isPublic';
import UserService from '@services/user/user.service';

type UserBasicInfo = Omit<User, 'refresh_token'>;

interface IResponseFindAll {
  users: UserBasicInfo[];
}

@ApiTags('users')
@Controller()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  @ApiParam({
    name: 'first_name',
    required: true,
    description: 'First name of user',
    type: String,
  })
  @ApiParam({
    name: 'last_name',
    required: true,
    description: 'Last name of user',
    type: String,
  })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'E-mail of user',
    type: String,
  })
  @ApiParam({
    name: 'password',
    required: true,
    description: 'Password of user',
    type: String,
  })
  @ApiParam({
    name: 'phone',
    required: true,
    description: 'Phone of user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'New user created',
    type: User,
  })
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async signup(
    @Body() body: CreateUserDTO,
  ): Promise<CreateUserResponse | HttpException> {
    return await this.userService.createUser(body);
  }

  @Public()
  @Get('/users')
  @ApiResponse({
    status: 200,
    description: 'All users founded',
    type: [User],
  })
  async find(): Promise<IResponseFindAll> {
    const users = await this.userService.findAll();

    return { users };
  }

  @Public()
  @Get('/users/:email')
  @ApiResponse({
    status: 200,
    description: 'User founded by e-mail',
    type: User,
  })
  async emailAlreadyExists(@Param('email') email: string): Promise<Object> {
    return await this.userService.emailAlreadyExists(email);
  }
}
