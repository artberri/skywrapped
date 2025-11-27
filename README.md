# Sky Wrapped

[Sky Wrapped](https://skywrapped.app) is a personalized year-in-review application for Bluesky users. Similar to Spotify Wrapped, it generates beautiful, shareable summaries of your Bluesky activity throughout the year, including your top posts, engagement stats, favorite hashtags, posting patterns, and more.

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Turso](https://turso.tech/) (LibSQL) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [ATProto OAuth](https://atproto.com/specs/oauth)
- **Deployment**: [Netlify](https://www.netlify.com/)
- **Package Manager**: [PNPM](https://pnpm.io/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Turso CLI](https://docs.turso.tech/cli/introduction)** - For local database management
- **[Proto](https://moonrepo.dev/proto)** - Tool version manager for synchronizing languages and tools

## Installation

1. **Install proto and synchronize tools**:

   ```sh
   proto install
   ```

2. **Install project dependencies**:

   ```sh
   pnpm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory based on the `.env.example` file.

4. **Generate JWK keys** (for production OAuth):

   Use the provided script to generate JWK keys:

   ```sh
   node bin/gen-jwk
   ```

5. **Set up the database**:

   Start the local Turso database:

   ```sh
   pnpm run db:start
   ```

   In another terminal, run the migrations:

   ```sh
   pnpm run db:migrate
   ```

## Development

### Start Development Server

Run both the database and development server concurrently:

```sh
pnpm run local
```

The development server will be available at `http://127.0.0.1:5173` (or the port specified in your `PORT` environment variable). Don't use `localhost` because the authentication against Bluesky will not work otherwise.

## Quality Assurance

Run all quality checks:

```sh
pnpm run qa
```

## Building

### Production Build

Create a production build:

```sh
pnpm run build
```

## Deployment

The project is configured for deployment on Netlify. The deployment process includes:

1. Installing dependencies
2. Running QA checks
3. Building the application
4. Running database migrations
5. Deploying to Netlify

To deploy manually:

```sh
pnpm run deploy
```

**Note**: Ensure all required environment variables are set in your Netlify dashboard before deploying.

## License

    Sky Wrapped - Personalized year-in-review application for Bluesky users
    Copyright (C) 2025 Alberto Varela <hello@albertovarela.net>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
