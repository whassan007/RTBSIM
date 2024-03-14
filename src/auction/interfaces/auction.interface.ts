export interface AuctionResult {
  id: number;
  title: string;
  winnerId: number;
  winningBidAmount?: number | null;
  totalBids: number;
  endTime: Date;
}