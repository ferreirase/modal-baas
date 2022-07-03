import { Test, TestingModule } from '@nestjs/testing';
import CreateUserDTO from '@dto/user/create-user.dto';
import User from '@models/user.entity';
import UserController from './user.controller';
import UserService from '@services/user/user.service';
import { Types } from 'mongoose';
import { hashSync } from 'bcrypt';

const users: User[] = [
  {
    _id: `${new Types.ObjectId()}`,
    first_name: 'Anderson Raphael',
    last_name: 'Ferreira',
    email: 'anderson@gmail.com',
    phone: '+5562982978229',
    password: `${hashSync('senha12345678', 10)}`,
  },
  {
    _id: `${new Types.ObjectId()}`,
    first_name: 'João Casemiro',
    last_name: 'Souza',
    email: 'casemiro@gmail.com',
    phone: '+5562982978229',
    password: `${hashSync('senha12345678', 10)}`,
  },
];

const userCreated = new User({
  _id: `${new Types.ObjectId()}`,
  first_name: 'Usuário',
  last_name: 'de Teste',
  email: 'usuariodeteste@gmail.com',
});

const userDto: CreateUserDTO = new CreateUserDTO({
  first_name: 'Usuário',
  last_name: 'de Teste',
  email: 'usuariodeteste@gmail.com',
  phone: '+5562982978229',
  password: `${hashSync('Senha123*', 10)}`,
});

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userCreated),
            findAll: jest.fn().mockResolvedValue(users),
            findByEmail: jest.fn().mockResolvedValue(users[0]),
            emailAlreadyExists: jest.fn().mockResolvedValue({
              emailNotExists: true,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should signup user successfully', async () => {
    // Act
    const result = await controller.signup(userDto);

    // Assert
    expect(result).not.toEqual(null);
    expect(result).toMatchObject({
      name: userCreated.first_name + ' ' + userCreated.last_name,
      email: userCreated.email,
    });
    expect(service.createUser).toHaveBeenCalledWith(userDto);
    expect(service.createUser).toHaveBeenCalledTimes(1);
  });

  it('should return an array of users or an empty array', async () => {
    // Act
    const users = await controller.find();

    // Assert
    expect(users).not.toEqual(null);
    expect(users).toBeInstanceOf(Array);

    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a property emailNotExist', async () => {
    const emailEncoded = 'Y2FzZW1pcm9AZW1haWwuY29tLmJy';
    const emailAlreadyExists = await controller.emailAlreadyExists(
      emailEncoded,
    );

    expect(emailAlreadyExists).toHaveProperty('emailNotExists');
  });
});
