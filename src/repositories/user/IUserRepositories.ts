import CreateUserDto from '@dto/user/create-user.dto';
import UpdateUserDto from '@dto/user/update-user.dto';
import User from '@models/user.entity';
import { Types } from 'mongoose';

export default interface IUserRepository {
  create: (user: CreateUserDto) => Promise<User>;
  update: (userId: string, data: UpdateUserDto) => Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findById(userId: Types.ObjectId): Promise<User>;
}
