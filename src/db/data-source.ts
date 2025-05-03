import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../auth/authEntity';
import { Order } from '../orders/entities/orderEntity';
import { Match } from '../orders/entities/matchEntity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'match',
    password: 'match123',
    database: 'match_exchange',
    synchronize: true,   
    logging: true,
    entities: [User, Order, Match],
});