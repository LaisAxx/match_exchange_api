import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  username!: string;

  @Column('varchar')
  type!: 'buy' | 'sell';

  @Column('decimal', { precision: 18, scale: 8 })
  amount!: number;

  @Column('decimal', { precision: 18, scale: 2 })
  price!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
