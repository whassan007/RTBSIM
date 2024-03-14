import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, AfterLoad } from 'typeorm';
import { Bid } from './bid.entity';

export enum AuctionStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reservePrice: number;

  @Column()
  askPrice: number; 

  @Column()
  impressions: number;

  @Column({ nullable: true })
  winnerId: number | null;

  @Column({ nullable: true })
  winningBidAmount: number | null;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.ACTIVE,
  })
  status: AuctionStatus;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

}