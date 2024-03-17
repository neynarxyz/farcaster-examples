import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/Context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";

const Signin = () => {
  const [_, setUser] = useLocalStorage("user");
  const [isClient, setIsClient] = useState(false);

  const [theme, setTheme] = useState("light");
  const [variant, setVariant] = useState("neynar");
  const [logoSize, setLogoSize] = useState("30px");
  const [height, setHeight] = useState("48px");
  const [width, setWidth] = useState("218px");
  const [borderRadius, setBorderRadius] = useState("10px");
  const [fontSize, setFontSize] = useState("16px");
  const [fontWeight, setFontWeight] = useState("300");
  const [padding, setPadding] = useState("8px 15px");
  const [margin, setMargin] = useState("0px");
  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [styles, setStyles] = useState("");
  const [customLogoUrl, setCustomLogoUrl] = useState("");

  useEffect(() => {
    // Identify or create the script element
    let script = document.getElementById(
      "siwn-script"
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "siwn-script";
      document.body.appendChild(script);
    }

    // Set attributes and source of the script
    script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Remove the script from the body
      if (script) {
        document.body.removeChild(script);
      }

      // Remove the button if it exists
      let button = document.getElementById("siwn-button");
      if (button && button.parentElement) {
        button.parentElement.removeChild(button);
      }
    };
  }, [
    theme,
    variant,
    logoSize,
    height,
    width,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    margin,
    text,
    color,
    backgroundColor,
    styles,
    customLogoUrl,
  ]);

  const { setSignerUuid, setFid } = useApp();
  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const neynar_login_url = process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL || "https://app.neynar.com/login";

  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    window.onSignInSuccess = (data) => {
      setUser({
        signerUuid: data.signer_uuid,
        fid: data.fid,
      });
      setSignerUuid(data.signer_uuid);
      setFid(data.fid);
    };

    return () => {
      delete window.onSignInSuccess; // Clean up the global callback
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderVariantDropdown = () => (
    <div className="flex flex-col items-start p-2 rounded shadow-sm">
      <label htmlFor="data-variant" className="mb-2 text-sm font-medium">
        data-variant
      </label>
      <select
        id="data-variant"
        value={variant}
        onChange={(e) => setVariant(e.target.value)}
        className="form-select rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
      >
        <option value="">Select variant</option>
        <option value="neynar">neynar</option>
        <option value="warpcast">warpcast</option>
        <option value="farcaster">farcaster</option>
      </select>
    </div>
  );

  const renderThemeDropdown = (variant: string) => {
    if (["neynar", "warpcast", "farcaster"].includes(variant)) {
      return (
        <div className="flex flex-col items-start p-2 rounded shadow-sm">
          <label htmlFor="data-theme" className="mb-2 text-sm font-medium">
            data-theme
          </label>
          <select
            id="data-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="form-select rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const getButton = useCallback(() => {
    return (
      <div
        className="neynar_signin mt-6"
        data-client_id={client_id}
        data-neynar_login_url={neynar_login_url}
        data-success-callback="onSignInSuccess"
        data-theme={theme}
        data-variant={variant}
        data-logo_size={logoSize}
        data-height={height}
        data-width={width}
        data-border_radius={borderRadius}
        data-font_size={fontSize}
        data-font_weight={fontWeight}
        data-padding={padding}
        data-margin={margin}
        data-text={text}
        data-color={color}
        data-background_color={backgroundColor}
        data-styles={styles}
        data-custom_logo_url={customLogoUrl}
      ></div>
    );
  }, [
    theme,
    variant,
    logoSize,
    height,
    width,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    margin,
    text,
    color,
    backgroundColor,
    styles,
    customLogoUrl,
  ]);

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">
            {isClient && getMessage(welcomeMessages)}
          </h2>

          {getButton()}
          <div className="flex flex-wrap gap-4 justify-center items-center p-4 mt-20 max-w-6xl">
            {renderThemeDropdown(variant)}
            {renderVariantDropdown()}
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-logo_size
              </label>
              <input
                value={logoSize}
                onChange={(e) => setLogoSize(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="30px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-height</label>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="48px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium">data-width</label>
              <input
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="218px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-border_radius
              </label>
              <input
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="10px 10px 10px 10px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-font_size
              </label>
              <input
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="24px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-font_weight
              </label>
              <input
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="normal"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-padding</label>
              <input
                value={padding}
                onChange={(e) => setPadding(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="8px 15px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-margin</label>
              <input
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="10px"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-text</label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="Custom sign in"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-color</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="#ffffff"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-background_color
              </label>
              <input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="#000000"
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">data-styles</label>
              <input
                value={styles}
                onChange={(e) => setStyles(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder={`{"minWidth" : "300px"}`}
              />
            </div>
            <div className="flex flex-col items-start p-2 rounded shadow-sm">
              <label className="mb-2 text-sm font-medium ">
                data-custom_logo_url
              </label>
              <input
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                type="text"
                className="form-input rounded mt-1 block w-full px-3 py-2 bg-white shadow-sm  placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm text-black"
                placeholder="https://demo.neynar.com/logos/wownar-black.svg"
              />
            </div>
          </div>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
