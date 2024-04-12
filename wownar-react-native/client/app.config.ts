import "dotenv/config";

export default ({ config }: any) => {
  return {
    ...config,
    extra: {
      SERVER_IP: process.env.SERVER_IP,
    },
  };
};
