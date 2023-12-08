export const welcomeMessages = [
  "Join the conversation. Sign in to share your story on Warpcast.",
  "Ready to make your mark? Sign in to start casting on Warpcast.",
  "Sign in to cast your thoughts and connect with the Warpcast community.",
  "Be part of the decentralized dialogue. Sign in to cast your first post now.",
  "Let's get your ideas out there. Sign in to start casting your unique perspective.",
  "Elevate your voice. Sign in and amplify your message.",
  "Connect, engage, and influence. Sign in to begin your Warpcast journey.",
  "Make waves with your words. Sign in and cast away!",
  "Sign in and join a new era of social networking.",
];

export const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};
