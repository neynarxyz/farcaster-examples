# wownar-react-sdk

## Introduction

`wownar-react-sdk` is a nextjs app that demonstrates the integration of [@neynar/react sdk](https://www.npmjs.com/package/@neynar/react) for [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn). `@neynar/`react` makes implementation much simpler by managing the state for you, which wasn't possible in an earlier version of [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn). 

## Prerequisites

- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine. Ensure you have Node.js installed on your system.

## Installation and Setup Environment

1. **Install Project Dependencies**: Based on the package manager run one of the following commands to install all required dependencies:

   For yarn

   ```bash
   yarn install
   ```

   For npm

   ```bash
   npm install
   ```

   Note: in order for the in-progress frames feature to work, you must run this command which pulls the `@neynar/react` sdk in locally and links it with `npm link`:
   ```bash
   npm i && git clone -b ds/create-isolated-frame-component https://github.com/neynarxyz/react.git && cd react && npm i && npm run build && npm link && cd .. && npm link @neynar/react
   ``` 

2. **Configure Environment Variables**

   - Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   - Edit `.env` to add your `NEYNAR_API_KEY` and `NEXT_PUBLIC_NEYNAR_CLIENT_ID`.

## Run Application

   - For yarn

      ```bash
      yarn dev
      ```

   - For npm

      ```bash
      npm run dev
      ```

## License

`wownar-react-sdk` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.