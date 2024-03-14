export interface BidType {
  bidderId: number;
  amount: number;
}

export interface AuctionType {
  askPrice: number;
  offers: BidType[];
  winner?: BidType;
}
