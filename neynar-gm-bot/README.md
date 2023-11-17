# neynar_gm_bot

A bot that will cast a 'Good Morning...{some emoji/emojis}' message in Warpcast at the scheduled time every day (As long as the system is online).

Powered By [Neynar API's](https://docs.neynar.com/). Built on top of [@neynar/nodejs-sdk](https://www.npmjs.com/package/@neynar/nodejs-sdk).

### Installation

#### Pre-requisite

[NodeJS](https://nodejs.org/en/) must be installed.

#### Setup

```
npm install -g pm2
```

#### Install project dependencies

```
yarn install
// or
npm install
```

#### Setup Environment

Add NEYNAR_API_KEY (Required), PUBLISH_CAST_TIME (Optional), TIME_ZONE (Optional) inside env.

```
cp .env.example .env
```

#### Generate Signer and get it approved

```
yarn get-approved-signer
```

#### Run Project

```
yarn start
// or
npm run start
```

#### Verify process is running

```
pm2 status
```

#### Logs

```
pm2 logs
```

#### Terminate process

```
pm2 kill
```
