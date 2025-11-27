# BetTracker Pro

Sports betting arbitrage tracker application that extracts and manages surebet data from PDF files.

## Features

- **PDF Extraction**: Accurately parses betting information from PDF documents
- **Surebet Detection**: Identifies arbitrage opportunities across multiple bookmakers
- **Triple Bet Support**: Handles double and triple bet configurations
- **Bookmaker Coverage**: 1000+ supported sportsbooks
- **Real-time Updates**: Live profit tracking and management

## Extracted Data

- Bookmaker names and country codes
- Odds for each bet
- Bet types (Over/Under, Asian Handicap, etc.)
- Stakes and profit calculations
- Profit percentages

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **PDF Processing**: pdfplumber (Python)

## Getting Started

```bash
npm install
npm run dev
```

## Docker Deployment

```bash
docker-compose up -d
```

See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for detailed deployment instructions.

## Project Structure

- `client/` - React frontend
- `server/` - Express backend
- `server/pdf/` - PDF extraction logic
- `shared/` - Shared types and schemas
- `server/storage.ts` - Data storage interface

## License

MIT