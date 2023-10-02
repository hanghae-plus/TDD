import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepositoryInterface } from './interfaces/orders-repository.interface';
import { OrdersComponent } from './orders.component';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockRepo: OrdersRepositoryInterface;
  let mockComp: Partial<OrdersComponent>;

  beforeEach(async () => {
    mockRepo = {
      doSomethingForOrder: jest.fn(),
      create: jest.fn(),
      all: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      createMany: jest.fn(),
      paginate: jest.fn(),
    };
    mockComp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: 'OrdersRepositoryInterface',
          useValue: mockRepo,
        },
        {
          provide: OrdersComponent,
          useValue: mockComp,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
