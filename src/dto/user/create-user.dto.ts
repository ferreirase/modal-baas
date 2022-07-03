import { Prop } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type CreateUserResponse = {
  _id: string;
  full_name: string;
  email: string;
};

export default class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @Prop({ type: String, default: null })
  @IsNotEmpty()
  refresh_token?: string;

  constructor(user?: Partial<CreateUserDto>) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.refresh_token = user.refresh_token;
  }
}
