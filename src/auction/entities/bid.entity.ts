import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auction } from './auction.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bidderId: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  submittedAt: Date;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction: Auction;
}