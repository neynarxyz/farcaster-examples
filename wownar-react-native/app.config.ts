import "dotenv/config";

export default ({ config }: any) => {
  return {
    ...config,
    extra: {
      NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
      NEYNAR_CLIENT_ID: process.env.NEYNAR_CLIENT_ID,
    },
  };
};
