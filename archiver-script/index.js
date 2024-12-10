import fs from "fs";

import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
const config = new Configuration({
	apiKey: "YOUR_NEYNAR_API_KEY"
})
const client = new NeynarAPIClient(config);

const parser = (cast) => {
	return {
		fid: parseInt(cast.author.fid),
		parentFid: parseInt(cast.parent_author.fid)
			? parseInt(cast.parent_author.fid)
			: undefined,
		hash: cast.hash || undefined,
		threadHash: cast.thread_hash || undefined,
		parentHash: cast.parent_hash || undefined,
		parentUrl: cast.parent_url || undefined,
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
	const response = await client.fetchCastsForUser({
		fid,
		limit: 150,
		cursor,
	});
	console.log(response.casts.length);
	response.casts.map(dumpCast);

  // If there is no next cursor, we are done
	if (response.next.cursor === null) return;
	await fetchAndDump(fid, response.next.cursor);
};

// save all @rish.eth's casts in a file called data.ndjson
const fid = 194;
fetchAndDump(fid);
