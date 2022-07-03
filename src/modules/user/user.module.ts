import { Module } from '@nestjs/common';
import UserService from '@services/user/user.service';
import UserController from '@controllers/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from '@models/user.entity';
import { MongoRepository } from '@repositories/user/user-repository-mongo';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, MongoRepository],
  exports: [UserService, JwtModule],
})
export default class UserModule {}
