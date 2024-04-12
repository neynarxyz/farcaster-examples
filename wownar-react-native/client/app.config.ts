import "dotenv/config";

export default ({ config }: any) => {
  return {
    ...config,
    extra: {
      COMPUTER_IP_ADDRESS: process.env.COMPUTER_IP_ADDRESS,
    },
  };
};
