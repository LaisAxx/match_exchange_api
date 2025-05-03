import { OrderService } from 'orders/services/orderService';
import { Order } from 'orders/entities/orderEntity';
import { AppDataSource } from 'db/data-source';
import { OrderType } from 'orders/constants/orderTypes';

jest.mock('db/data-source');

//mocks
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOneBy = jest.fn();
const mockRemove = jest.fn();

(AppDataSource.getRepository as jest.Mock).mockReturnValue({
  create: mockCreate,
  save: mockSave,
  findOneBy: mockFindOneBy,
  remove: mockRemove,
});

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma ordem com sucesso', async () => {
    const fakeOrder: Partial<Order> = {
      username: 'lais',
      type: 'buy',
      amount: 1,
      price: 50000,
    };

    mockCreate.mockReturnValue(fakeOrder);
    mockSave.mockResolvedValue(fakeOrder);

    const result = await OrderService.createOrder('lais', OrderType.BUY, 1, 50000);

    expect(mockCreate).toHaveBeenCalledWith(fakeOrder);
    expect(mockSave).toHaveBeenCalledWith(fakeOrder);
    expect(result).toEqual(fakeOrder);
  });

  it('deve cancelar uma ordem com sucesso', async () => {
    const fakeOrder = { id: '123', username: 'lais' };
    mockFindOneBy.mockResolvedValue(fakeOrder);
    mockRemove.mockResolvedValue(undefined);

    const result = await OrderService.cancelOrder('123', 'lais');

    expect(mockFindOneBy).toHaveBeenCalledWith({ id: '123', username: 'lais' });
    expect(mockRemove).toHaveBeenCalledWith(fakeOrder);
    expect(result).toBe(true);
  });

  it('deve retornar false se a ordem não for encontrada para cancelamento', async () => {
    mockFindOneBy.mockResolvedValue(null);

    const result = await OrderService.cancelOrder('not-found', 'lais');

    expect(mockFindOneBy).toHaveBeenCalledWith({ id: 'not-found', username: 'lais' });
    expect(mockRemove).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
