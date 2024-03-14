# Auction Bidding System
## [Analysis Document](Analysis.md)
## Overview

The Auction Bidding system is designed to facilitate online auctions, allowing users to place bids on items. Built with Nest.js and TypeORM, it ensures efficient and scalable server-side application development, capable of handling multiple auctions and real-time bid tracking.

## Key Components

- **Auction Entity**: Represents the auctions with details like start/end times, reserve price, and status.
- **Bid Entity**: Represents bids made by users, including bidder details and the bid amount.
- **Auction Service**: Manages auctions, bid placement, and finalizes auctions based on rules.

## Architectural & Other Considerations

### Scalability
The system utilizes Nest.js modules for scalability and isolation of application parts, facilitating easy maintenance and scale-ups.

### Real-time Bidding
Future enhancements could include real-time updates for bids using WebSockets, supported natively by Nest.js, to improve user experience.

### Data Integrity and Validation
TypeORM ensures data integrity, and DTOs are used for data validation, maintaining the system's reliability.

### Error Handling
The system provides clear feedback for errors, like bidding on an ended auction or duplicate bidding.

## Challenges, Considerations, and Requirements

### Time Synchronization
Correct time handling is crucial for auction timing. Server time synchronization and time zone considerations are important.

### Bid Validation
Bids must comply with auction rules, requiring checks for bid validity and compliance.

### Auction Finalization
Determining winning bids and finalizing auctions involves handling no-bid situations and reserve price considerations.

### Security
Authentication and authorization are important for protecting user data and ensuring bid integrity.

## Detailed Walkthrough

### Starting an Auction
`startAuction` creates and starts a new auction, setting its duration and initial details.

### Adding a Bid
`addBid` allows users to place bids, ensuring the auction's validity and preventing duplicate bids.

### Getting Auction Results
`getAuctionResults` retrieves all auction results, including winners and winning bids.

### Finalizing Auctions
`finalizeAuctions` finalizes auctions based on end times and highest bids, marking them accordingly.

## Conclusion

This Auction Bidding system showcases a robust implementation with Nest.js and TypeORM, focusing on scalability, real-time interactions, and data integrity. Future enhancements could further improve user experience and auction functionality.



# RTB Simulator

### Prerequisites

- Ensure that you have `node.js` and `npm` installed. If not, follow the steps below:

```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

- Install nvm (Node Version Manager) to manage multiple versions of Node.js:


```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install v18.18.0
```

- Update npm to the latest version:

```bash
npm install -g npm@latest
```

- Install pnpm globally:


```bash
npm install -g pnpm
```


- Clone the Repository


```bash
cd ~
git clone https://github.com/whassan007/RTBSimulator.git
cd RTBSimulator
```

- Install Dependencies and Build

```bash
pnpm install
```


- Configuration


Create a .env file in the root folder and add the following configuration:

```env
PORT=3100
DB_NAME=rtb
DB_USER=root
DB_PASSWORD=password
```

Make sure to update the database password accordingly.


- Running the Application

To start the RTB Simulator in development mode, run:

```bash
pnpm run start:dev
```

That's it! You should now have RTB Simulator up and running locally on your machine.


## Api

To Start auction

curl --location 'http://localhost:3100/auction/start' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'askPrice=80' \
--data-urlencode 'reservePrice=100' \
--data-urlencode 'impressions=50'


Place bid


curl --location 'http://localhost:3100/auction/bid' \
--header 'Content-Type: application/json' \
--data '{
    "bidderId": 1,
    "amount": 100,
    "auctionId": 1
}'


Get auction result


curl --location 'http://localhost:3100/auction/results'

