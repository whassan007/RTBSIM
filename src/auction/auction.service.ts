import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Auction, AuctionStatus } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { AuctionResult } from './interfaces/auction.interface'; 
// import { IntervalScheduler, Scheduler } from '@nestjs/schedule';
import { CreateBidDto } from './dto/create-bid.dto';


@Injectable()
export class AuctionService {
  private readonly logger = new Logger('AuctionService');
  private _currentAuction: Auction | null = null;

  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  // ---------------------------------------------------------
  // Auction Management
  // ---------------------------------------------------------

  /**
   * Starts a new auction by creating a record in the database.
   *
   * @param auctionData Auction information for creation
   * @returns Information about the started auction
   */  
  public async startAuction(auctionData: Auction) {
    const newAuction = await this.auctionRepository.create({
      askPrice: auctionData.askPrice,
      reservePrice: auctionData.reservePrice,
      impressions: auctionData.impressions,
      startTime: new Date(),
      endTime: new Date(Date.now() + 600000), // auction end in 10 minute
    });

    this._currentAuction = await this.auctionRepository.save(newAuction);

    return {
      auctionId: this.currentAuction.id,
      message: 'Auction started successfully',
    };
  }

  // ---------------------------------------------------------
  // Bid Management
  // ---------------------------------------------------------

  /**
   * Adds a new bid to an existing auction.
   *
   * @param bidData Bid information to be added
   * @returns Information about the added bid or error messages
   */  
  public async addBid(bidData: CreateBidDto) {

    const { auctionId, bidderId, amount } = bidData;
  
    const auction = await this.auctionRepository.findOne({
      where: {
        id: auctionId
      },
      relations: ['bids']
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.endTime.getTime() < new Date().getTime()) {
      return { 
        message: 'Auction has already ended. No bids can be placed.',
      };
    }
  
    // Check for existing bid from the same bidder
    const existingBid = auction.bids.find(bid => bid.bidderId === bidderId);

    if (existingBid) {
      return {
        message: 'You have already placed a bid for this auction.',
      };
    }

    const newBid = await this.bidRepository.create({
      bidderId: bidderId,
      amount: amount,
      auction: auction,
      submittedAt: new Date()
    });

    const bidResult = await this.bidRepository.save(newBid);

    return {
      id: bidResult.id,
      message: 'Bid placed successfully',
    };
  }

  // ---------------------------------------------------------
  // Auction Results
  // ---------------------------------------------------------

  /**
   * Retrieves essential details for completed auctions.
   *
   * @returns A list of simplified auction results
   */  
  public async getAuctionResults(): Promise<AuctionResult[]> {

    const auctions = await this.auctionRepository.find({
      relations: ['bids'],
    });
  
    const auctionResults: AuctionResult[] = auctions.map(auction => ({
      id: auction.id,
      title: `auction_${auction.id}`,
      winnerId: auction.winnerId,
      winningBidAmount: auction.winningBidAmount,
      totalBids: auction.bids.length,
      endTime: auction.endTime,
    }));
  
    return auctionResults;
  }

  // ---------------------------------------------------------
  // Auction Finalization
  // ---------------------------------------------------------

  /**
   * Processes ending auctions, determines winners, and updates their status.
   */  
  public async finalizeAuctions(): Promise<void> {
 
    const activeAuctions = await this.auctionRepository.find({
      where: {
        status: AuctionStatus.ACTIVE,
      },
      relations: ['bids'], 
    });    

    for (const auction of activeAuctions) {
      if (auction.endTime.getTime() < new Date().getTime()) {      
        auction.status = AuctionStatus.FINISHED;
        await this.auctionRepository.save(auction);
      } else {
        // Auction is still active, proceed with winner check as before
        if (auction.bids.length) {
          const bids = auction.bids;
          const winningBid = bids.reduce((prev, curr) => (prev?.amount || 0) > curr.amount ? prev : curr, null);
  
          if (winningBid) {
            auction.winnerId = winningBid.id;
            await this.auctionRepository.save(auction);
            this.logger.log(`Auction ${auction.id} winner: ${winningBid.bidderId}, Winning amount: ${winningBid.amount}`);
          } else {
            this.logger.log(`Auction ${auction.id} has no bids.`);
          }
        } else {
          this.logger.log(`Auction ${auction.id} already has a winner.`);
        }
      }
    }
  }


  // ---------------------------------------------------------
  // Getters
  // ---------------------------------------------------------

  /**
   * Provides access to the currently active auction, if any.
   *
   * @returns The current auction object or null if none is active
   */  
  public get currentAuction(): Auction | null {
    return this._currentAuction;
  }
}
