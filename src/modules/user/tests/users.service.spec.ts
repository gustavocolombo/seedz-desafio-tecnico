import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users.entity';
import { UsersService } from '../services/users.service';

describe('Test user service', () => {
  let userService: UsersService;
  let userRepository: Repository<Users>;

  const mockReturnUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDataUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'pass123',
  };

  const mockReturnDeleteUser = {
    affected: 1,
    performed: true,
  };

  const mockGetUser = '59be34f1-6db9-4c20-b9e2-8f46f5f1a151';

  const mockReturnUpdateUser = {
    affected: 1,
    performed: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockReturnUser),
            create: jest.fn().mockReturnValue(mockReturnUser),
            delete: jest.fn().mockReturnValue(mockReturnDeleteUser),
            update: jest.fn().mockReturnValue(mockReturnUpdateUser),
            save: jest.fn().mockResolvedValue(mockReturnUser),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('Service should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Test create function in service', () => {
    it('Should be able create a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      const user = await userService.create(mockDataUser);

      expect(user).toEqual(mockReturnUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toBeCalledWith({
        where: { email: mockDataUser.email },
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test get user function in service', () => {
    it('Should be able get a user', async () => {
      const user = await userService.index(mockGetUser);

      expect(user).toEqual(mockReturnUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetUser },
      });
    });
  });

  describe('Test update function in service', () => {
    it('Should be able update a user', async () => {
      const mockUpdateUser = Object.assign(mockDataUser, {
        id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
      });

      const user = await userService.update(mockUpdateUser);
      expect(user).toEqual(mockReturnUpdateUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetUser },
      });
      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test delete function in service', () => {
    it('Should be able delete a user', async () => {
      const user = await userService.delete(mockGetUser);

      expect(user).toEqual(mockReturnDeleteUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetUser },
      });
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
