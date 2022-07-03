import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export interface IUser extends Document {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  refresh_token?: string;
}

@Schema()
export default class User {
  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  @ApiProperty()
  _id: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @Prop({ type: String, default: null })
  @IsNotEmpty()
  @ApiProperty()
  refresh_token?: string;

  constructor(user?: Partial<User>) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.refresh_token = user.refresh_token;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
