import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('varchar')
  username!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 100000 })
  usdBalance!: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 100 })
  btcBalance!: number;
}

  