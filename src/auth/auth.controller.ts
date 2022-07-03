import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '@auth/decorators/isPublic';
import { Response } from 'express';
import { ApiParam } from '@nestjs/swagger';

interface IUserLoginDto {
  account: string;
  password: string;
}

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('/')
  @ApiParam({
    name: 'password',
    required: true,
    description: 'Password used to login',
    type: String,
  })
  @ApiParam({
    name: 'account',
    required: true,
    description: 'Account used to login',
    type: String,
  })
  @HttpCode(200)
  async login(@Body() user: IUserLoginDto, @Res() res: Response) {
    const userLogged = await this.authService.login(user);

    return res.json(userLogged);
  }
}
