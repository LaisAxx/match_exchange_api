import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  buyer!: string;

  @Column('varchar', { nullable: false })
  seller!: string;

  @Column('decimal', { precision: 19, scale: 2, nullable: false, default: 0 })
  price!: number;

  @Column('decimal', { precision: 19, scale: 8, nullable: false, default: 0 })
  amount!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
