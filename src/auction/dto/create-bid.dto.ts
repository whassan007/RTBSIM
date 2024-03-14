import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBidDto {
  
  @IsNumber({}, { message: 'Auction Id must be a number' })
  @IsNotEmpty({ message: 'Auction Id should not be empty' })
  auctionId: number;

  @IsNumber({}, { message: 'Bidder Id must be a number' })
  @IsNotEmpty({ message: 'Bidder Id should not be empty' })
  bidderId: number;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  amount: number;
}
