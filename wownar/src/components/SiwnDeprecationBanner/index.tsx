import Link from "next/link";

// Date.UTC months are 0-indexed, so 7 = August.
const isSiwnRetired = () => Date.now() >= Date.UTC(2026, 7, 14);

const SiwnDeprecationBanner = () => {
  const retired = isSiwnRetired();

  return (
    <div className="w-full bg-amber-500/15 border-b border-amber-400/40 text-amber-200 text-center text-sm px-4 py-2">
      <span className="font-bold">
        {retired
          ? "Sign In With Neynar has been retired."
          : "Sign In With Neynar is being retired on August 14, 2026."}
      </span>{" "}
      Use{" "}
      <Link
        href="https://docs.neynar.com/docs/integrate-managed-signers"
        target="_blank"
        className="underline"
      >
        Neynar-managed signers
      </Link>{" "}
      instead.
    </div>
  );
};

export default SiwnDeprecationBanner;
