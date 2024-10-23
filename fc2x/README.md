# FC2X
Crosspost all of your casts from Farcaster to X

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fneynarxyz%2Ffarcaster-examples%2Ftree%2Fmain%2Ffc2x"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

## Getting Started

### 1. Install Dependencies

First, install local dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Add Environment Variables

Then, copy `.env.example` to a new `.env.local` file and add the necessary environment variables. Here's some information on where you can find/create the necessary credentials:

| Credential(s)                   | Description                                     |
|------------------------|-------------------------------------------------|
| `NEXT_PUBLIC_NEYNAR_CLIENT_ID` and `NEYNAR_API_KEY`       | Your Neynar Client ID and API Key can be found on the [Neynar Dev Portal](https://dev.neynar.com) on the page for your app(make sure to create an app if you haven't already).  |
| `NEYNAR_WEBHOOK_ID` and `NEYNAR_WEBHOOK_SECRET`            | Go to the [Neynar Dev Portal](https://dev.neynar.com) and create a webhook where the target URL is `${YOUR_PROD_URL}/api/webhook`. Then grab the webhook's ID and set it as your `NEYNAR_WEBHOOK_ID` value, as well the webhook's secret value for `NEYNAR_WEBHOOK_SECRET`. |
| `POSTGRES_URL`              | The connection URL for your Postgres DB. To create all of the tables necessary for this project, run the SQL query in `Initial Migration.md`. |
| `TWITTER_CALLBACK_URL`              | The callback URL for Twitter authentication. Set this value to `${YOUR_PROD_URL}/api/callback`, and make sure to set this on the [Twitter/X Developer Portal](https://developer.x.com/en/portal) as well. |
| `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET`  | The API Key and API Key Secret for your Twitter app, which you find(or create) on the [Twitter/X Developer Portal](https://developer.x.com/en/portal). |

### 3. Run the development server

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
