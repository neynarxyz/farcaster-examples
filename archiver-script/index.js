import fs from "fs";

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
const client = new NeynarAPIClient("YOUR_NEYNAR_API_KEY");

const parser = (cast) => {
	return {
		fid: parseInt(cast.author.fid),
		parentFid: parseInt(cast.parentAuthor.fid)
			? parseInt(cast.parentAuthor.fid)
			: undefined,
		hash: cast.hash || undefined,
		threadHash: cast.threadHash || undefined,
		parentHash: cast.parentHash || undefined,
		parentUrl: cast.parentUrl || undefined,
		text: cast.text || undefined,
	};
};

// parse and save to file
const dumpCast = (cast) => {
	const parsed = parser(cast);
	const data = `${JSON.stringify(parsed)}\n`;
	fs.appendFileSync("data.ndjson", data);
};

const fetchAndDump = async (fid, cursor) => {
	const data = await client.fetchAllCastsCreatedByUser(fid, {
		limit: 150,
		cursor,
	});
	data.result.casts.map(dumpCast);

  // If there is no next cursor, we are done
	if (data.result.next.cursor === null) return;
	await fetchAndDump(fid, data.result.next.cursor);
};

// save all @rish.eth's casts in a file called data.ndjson
const fid = 194;
fetchAndDump(fid);
