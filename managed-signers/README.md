# Write casts with managed signers

## Prerequisites

- Make sure you have Node.js and yarn installed on your machine.

## Setup

1. **Install Dependencies**:
   To ensure that all the required libraries and modules are installed, run:

   ```bash
   yarn install
   ```

2. **Environment Configuration**:
   We use environment variables for various configurations. Start by copying the example environment variables file:

   ```bash
   cp .env.example .env.local
   ```

3. **Update Environment Variables**:
   Open the `.env.local` file in your favorite editor and make sure to replace placeholders with the correct values.

   ```bash
   open .env.local
   ```

   🔔 Notes:

   - NEYNAR_API_KEY: If you need one, sign up on [https://neynar.com](https://neynar.com)
   - FARCASTER_DEVELOPER_MNEMONIC: The 12 or 24 word recovery phrase for the Farcaster account. Make sure the value is within single quotes.
   - A farcaster developer account is the same as any farcaster account. You can use your personal account as a farcaster developer account e.g. https://warpcast.com/manan or your company / branded developer account like https://warpcast.com/neynar

4. **Start the App**:
   To start the Sample Farcaster app in development mode, run:

   ```bash
   yarn start
   ```

   Your app should now be running on `localhost:3000` (or a specified port in your `.env`).

## Troubleshooting

- If you run into issues with missing packages, make sure to run `yarn install` again.
- Ensure all environment variables in `.env.local` are correctly set.

## Feedback

If you have any feedback or run into issues, please reach out to our team or create an issue on the repository.

---

Happy coding! 🚀
