import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../../products/entities/Products.entity';
import { Users } from '../../user/entities/Users.entity';
import { Sales } from '../entities/Sales.entity';
import { SalesService } from '../services/sales.service';

describe('Test Sales service', () => {
  let salesService: SalesService;
  let salesRepository: Repository<Sales>;
  let usersRepository: Repository<Users>;
  let productsRepository: Repository<Products>;

  const mockReturnSale = {
    id: 'a5b49ca8-b8a0-4c7c-b795-39eed7aaf450',
    qtdProducts: 10,
    user_id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
    product_id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
    finalPrice: 249,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReturnAllSales = [
    {
      id: 'a5b49ca8-b8a0-4c7c-b795-39eed7aaf450',
      qtdProducts: 10,
      user_id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
      product_id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
      finalPrice: 250,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a5b49ca8-b8a0-4c7c-b795-39eed7aaf450',
      qtdProducts: 15,
      user_id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
      product_id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
      finalPrice: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a5b49ca8-b8a0-4c7c-b795-39eed7aaf450',
      qtdProducts: 5,
      user_id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
      product_id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
      finalPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockDataSales = {
    product_id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
    user_id: '59be34f1-6db9-4c20-b9e2-8f46f5f1a151',
    qtdProducts: 10,
  };

  const mockGetUser = '59be34f1-6db9-4c20-b9e2-8f46f5f1a151';

  const mockGetProduct = 'dde32fc4-68f1-4453-bef8-c9b7e46150fb';

  const mockGetSale = 'a5b49ca8-b8a0-4c7c-b795-39eed7aaf450';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sales),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockReturnSale),
            find: jest.fn().mockReturnValue(mockReturnAllSales),
            create: jest.fn().mockReturnValue(mockReturnSale),
            save: jest.fn().mockResolvedValue(mockReturnSale),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockGetUser),
          },
        },
        {
          provide: getRepositoryToken(Products),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockGetProduct),
          },
        },
      ],
    }).compile();

    salesService = module.get<SalesService>(SalesService);
    salesRepository = module.get<Repository<Sales>>(getRepositoryToken(Sales));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    productsRepository = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('Service should be defined', () => {
    expect(salesService).toBeDefined();
  });

  describe('Test create sale function', () => {
    it('Should be able create a sale', async () => {
      const sale = await salesService.create(mockDataSales);

      expect(sale).toEqual(mockReturnSale);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetUser },
      });
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetProduct },
      });
      expect(salesRepository.create).toHaveBeenCalledTimes(1);
      expect(salesRepository.save).toHaveBeenCalledTimes(1);
    });
    it('Should not be able create a sale with empty user', async () => {});
  });

  describe('Test get sale by id', () => {
    it('Should be able get a sale by id', async () => {
      const sale = await salesService.getSaleById(mockGetSale);

      expect(sale).toEqual(mockReturnSale);
      expect(salesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(salesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetSale },
      });
    });
    it('Should not be able get sale by id', async () => {
      jest.spyOn(salesRepository, 'findOne').mockReturnValueOnce(null);

      await expect(
        Promise.reject(await salesService.getSaleById(mockGetSale)),
      ).rejects.toEqual(null);
      expect(salesRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test get sale by id of user', () => {
    it('Should be able get a sale by id of user', async () => {
      const sale = await salesService.getSaleByUser(mockGetUser);

      expect(sale).toEqual(mockReturnAllSales);
      expect(salesRepository.find).toHaveBeenCalledTimes(1);
      expect(salesRepository.find).toHaveBeenCalledWith({
        where: { user_id: mockGetUser },
      });
    });
    it('Should not be able return sales by id of user', async () => {
      jest.spyOn(salesRepository, 'find').mockReturnValueOnce(null);

      await expect(
        Promise.reject(await salesRepository.find()),
      ).rejects.toEqual(null);
      expect(salesRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
