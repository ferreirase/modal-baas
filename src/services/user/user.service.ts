import { Types } from 'mongoose';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from '@repositories/user/user-repository-mongo';
import IUserRepository from '@repositories/user/IUserRepositories';
import CreateUserDTO, { CreateUserResponse } from '@dto/user/create-user.dto';
import UpdateUserDTO, { UpdateUserResponse } from '@dto/user/update-user.dto';
import User from '@models/user.entity';
import { passwordRegex, emailRegex } from '@shared/utils/regex';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(
    @Inject(MongoRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    user: CreateUserDTO,
  ): Promise<CreateUserResponse | HttpException> {
    if (!passwordRegex.test(String(user.password))) {
      throw new HttpException('Password is invalid!', 400);
    }

    if (!emailRegex.test(user.email)) {
      throw new HttpException('E-mail is invalid', 400);
    }

    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists) {
      throw new HttpException('E-mail already exists!', 400);
    }

    const newUser = await this.userRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, 10),
      refresh_token: this.jwtService.sign(
        {
          email: user.email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    });

    return {
      _id: newUser._id,
      full_name: newUser.first_name + ' ' + newUser.last_name,
      email: newUser.email,
    };
  }

  async updateUser(
    email: string,
    data: UpdateUserDTO,
  ): Promise<UpdateUserResponse> {
    const userExists = await this.userRepository.findByEmail(email);

    if (!userExists) {
      throw new HttpException('User not found', 400);
    }

    const userUpdated = await this.userRepository.update(userExists._id, data);

    return {
      _id: userUpdated._id,
      full_name: userUpdated.first_name + ' ' + userUpdated.last_name,
      email: userUpdated.email,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
  }

  async findByEmail(email: string): Promise<User> {
    if (!emailRegex.test(email)) {
      throw new HttpException('E-mail is invalid', 400);
    }

    return await this.userRepository.findByEmail(email);
  }

  async emailAlreadyExists(email: string): Promise<Object> {
    const emailDecoded = Buffer.from(email, 'base64').toString('ascii');

    if (!emailRegex.test(emailDecoded)) {
      throw new HttpException('E-mail is invalid', 400);
    }

    const user = await this.findByEmail(emailDecoded);

    if (user) {
      throw new HttpException('E-mail already exists', 400);
    }

    return {
      emailNotExists: true,
    };
  }

  async findById(id: Types.ObjectId): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
