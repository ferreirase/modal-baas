import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import AccountService from '@services/account/account.service';
import UserService from '@services/user/user.service';

interface IUserLoginDto {
  account: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validate(account: string, password: string) {
    const accountExists = await this.accountService.findByNumber(account);

    const user = await this.userService.findById(accountExists.user_owner);

    if (user && (await compare(password, user.password))) {
      return {
        _id: user._id,
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        refresh_token: user?.refresh_token,
        account: accountExists,
      };
    }
  }

  async login(user: IUserLoginDto) {
    const currentUser = await this.validate(user.account, user.password);

    const userInfosToReturn = {
      ...currentUser,
    };

    delete userInfosToReturn?.refresh_token;
    delete userInfosToReturn?.account;

    const updatedUser = await this.userService.updateUser(currentUser.email, {
      ...currentUser,
      refresh_token: this.jwtService.sign(
        {
          email: currentUser.email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    });

    const access_token = this.jwtService.sign(
      {
        email: currentUser.email,
        sub: currentUser._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return {
      user: userInfosToReturn,
      auth: {
        refresh_token: updatedUser?.refresh_token,
        access_token,
      },
    };
  }
}
