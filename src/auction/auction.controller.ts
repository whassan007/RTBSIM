import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuctionService } from '../auction/auction.service';
import { Bid } from './entities/bid.entity';
import { Auction } from './entities/auction.entity';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  /**
   * Initiates a new auction by sending auction data to the service layer.
   * 
   * @param auctionData Data for the new auction
   * @returns Information about the started auction 
   */  
  @Post('/start')
  postStartAutcion(@Body() auctionData: Auction) {
    console.log('auctionData ', auctionData);
    const data = this.auctionService.startAuction(auctionData);
    return data;
  }


  /**
   * Submits a new bid for an auction using the provided bid details.
   * 
   * @param bidData Information about the bid to be placed
   * @returns Confirmation message upon successful bid placement
   */  
  @Post('/bid')
  postBid(@Body() bidData: CreateBidDto) {

    try {
        this.auctionService.addBid(bidData);
        return { message: 'Bid received successfully' };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves a list of completed auction results containing essential details.
   * 
   * @returns A list of simplified auction result objects
   */  
  @Get('/results')
  getAuctionResults() {
    try {
        return this.auctionService.getAuctionResults();
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
