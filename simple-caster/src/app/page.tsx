import Image from "next/image";

const welcomeMessages = [
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

const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <Image
            src="/simple-caster-logo.png"
            width={40}
            height={40}
            alt="SimpleCaster Logo"
          />
          <h1 className="text-xl font-extralight font-bold ml-3">
            SimpleCaster
          </h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2">
            <Image
              src="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FLPzRlQl.jpg"
              width={40}
              height={40}
              alt="User Icon"
            />
          </span>
          <span>UserName</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extralight mb-4">
          {getMessage(welcomeMessages)}
        </h2>
        <button className="border border-white px-6 py-2 rounded">
          Sign In
        </button>
      </main>

      <footer className="text-center p-4">Powered by Neynar</footer>
    </div>
  );
}
