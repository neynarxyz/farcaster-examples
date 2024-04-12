# wownar-react-native

## Introduction

`wownar-react-native` is an expo app that demonstrates the integration of [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn).

## Prerequisites

- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine. Ensure you have Node.js installed on your system.
- [Expo Go](https://expo.dev/client): Install Expo Go on your phone

## Installation and Setup Environment

### Server

1. **Navigate to server directory**: Navigate to the server directory

   ```bash
   cd server
   ```

2. **Install Project Dependencies**: Based on the package manager run one of the following commands to install all required dependencies:

   For yarn

   ```bash
   yarn install
   ```

   For npm

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to add your `NEYNAR_API_KEY` and `NEYNAR_CLIENT_ID`.

4. **Start the server**:
   For yarn

   ```bash
   yarn start
   ```

   For npm

   ```bash
   npm run start
   ```

### Client

Open new terminal

1. **Navigate to server directory**: Navigate to the client directory

   ```bash
   cd client
   ```

2. **Install Project Dependencies**: Based on the package manager run one of the following commands to install all required dependencies:

   For yarn

   ```bash
   yarn install
   ```

   For npm

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to add your `COMPUTER_IP_ADDRESS`. Refer [find-IP-address article](https://www.avg.com/en/signal/find-ip-address) to get IP address of your Computer

4. **Start the app**: (Make sure your phone and computer is connected to the same network)

   For yarn

   ```bash
   yarn start
   ```

   For npm

   ```bash
   npm run start
   ```

   you'll see a QR Code

5. **Run App**:

   Open Expo Go app on your phone and scan the QR Code

## License

`wownar-react-native` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.
