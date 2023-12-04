# Neynar Archiver Mini-App

Welcome to the Neynar Mini-App! This Nodejs (Bun) script uses Neynar's API to fetch and archive casts of a specific user. Follow these steps to get started:

## Steps

### Step 1: Clone the Repository

Clone the Neynar Mini-App repository to your local machine:

```sh
git clone https://github.com/neynarxyz/farcaster-examples
```

### Step 2: Prepare the Application Directory

Move the Flask app directory to your desired location and remove the cloned repository's extra contents:

```sh
mv farcaster-examples/archiver-script .
rm -rf farcaster-examples
cd archiver-script
```

### Step 3: Bun install

Install the required Nodejs packages:

```sh
bun install
```

### Step 4: Edit the FID

Open `index.js` and replace the `FID` with your own:

```javascript
// save all @rish.eth's casts in a file called data.ndjson
const fid = 194;
fetchAndDump(fid);
```

### Step 5: Run the Script

```sh
bun run index.js
```

You should now be ready to run the script, saving the casts of the user with the FID you specified to a file called `data.ndjson` in the same directory as `index.js`.
