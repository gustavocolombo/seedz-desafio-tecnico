import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../entities/Products.entity';
import { ProductsService } from '../services/products.service';

describe('Test Service of Products', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Products>;

  const mockReturnProduct = {
    name: 'prod1',
    qtdAvailable: 30,
    price: 24.9,
    id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDataProduct = {
    name: 'prod1',
    qtdAvailable: 30,
    price: 24.9,
  };

  const mockGetProduct = '59be34f1-6db9-4c20-b9e2-8f46f5f1a151';

  const mockReturnAllProducts = [
    {
      name: 'prod2',
      qtdAvailable: 20,
      price: 20.1,
      id: 'dde32fc4-68f1-4453-bef8-c9b7e46150fb',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'prod2',
      qtdAvailable: 25,
      price: 26.9,
      id: 'abc32fc4-68f1-4453-bef8-c9b7e4615045',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockReturnProduct),
            create: jest.fn().mockReturnValue(mockReturnProduct),
            delete: jest.fn().mockReturnValue(mockReturnProduct),
            update: jest.fn().mockReturnValue(mockReturnProduct),
            save: jest.fn().mockResolvedValue(mockReturnProduct),
            find: jest.fn().mockReturnValue(mockReturnAllProducts),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('Service should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('Test create product function in service', () => {
    it('Should be able create a user', async () => {
      const product = await productsService.create(mockDataProduct);

      expect(product).toEqual(mockReturnProduct);
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test get one product function in service', () => {
    it('Should be able return one product', async () => {
      const product = await productsService.index(mockGetProduct);

      expect(product).toEqual(mockReturnProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetProduct },
      });
    });
  });

  describe('Test get all products function in service', () => {
    it('Should be able return a list of products', async () => {
      const product = await productsService.show();

      expect(product).toEqual(mockReturnAllProducts);
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test update a product function in service', () => {
    it('Should be able update a product', async () => {
      const mockUpdateProduct = Object.assign(mockDataProduct, {
        id: 'abc32fc4-68f1-4453-bef8-c9b7e4615045',
      });
      const product = await productsService.update(mockUpdateProduct);

      expect(product).toEqual(mockReturnProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUpdateProduct.id },
      });
      expect(productsRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test delete a product function in service', () => {
    it('Should be able delete a product', async () => {
      const product = await productsService.delete(mockGetProduct);

      expect(product).toEqual(mockReturnProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGetProduct },
      });
      expect(productsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
