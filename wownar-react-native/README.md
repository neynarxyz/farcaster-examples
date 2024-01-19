# wownar-react-native

## Introduction

`wownar-react-native` is an expo app that demonstrates the integration of [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn).

## Prerequisites

- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine. Ensure you have Node.js installed on your system.
- [Expo Go](https://expo.dev/client): Install Expo Go on your phone

## Installation

### Setting Up the Environment

1. **Install Project Dependencies**: Navigate to the project directory and run one of the following commands to install all required dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

2. **Configure Environment Variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to add your `NEYNAR_API_KEY` and `NEYNAR_CLIENT_ID`.

## Running the Bot

1. **Start the app**: Launch the app using the following command:

   ```bash
   yarn start
   # or
   npm run start
   ```

    you'll see a QR Code

2. **Run App**: 

   Open Expo Go app on your phone and scan the QR Code


## License

`wownar-react-native` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.
