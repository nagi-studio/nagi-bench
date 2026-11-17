import type { CSSProperties } from "react";
import type { WeaponId } from "../game/types";

export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    crosshair: (
      <>
        <circle cx="12" cy="12" r="6" />
        <path d="M12 2v5m0 10v5M2 12h5m10 0h5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5z" />
        <path d="m8 11 3 3 5-6" />
      </>
    ),
    attack: (
      <>
        <path d="m4 20 8-8m2-2 6-6M5 4l15 15M4 3l4 1-4 4zm17 17-4-1 4-4zM12 4v4m8 4h-4M4 12h4m4 8v-4" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    external: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    volume: (
      <>
        <path d="m11 4-5 5H2v6h4l5 5zM15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" />
      </>
    ),
    mute: (
      <>
        <path d="m11 4-5 5H2v6h4l5 5zM16 9l6 6m0-6-6 6" />
      </>
    ),
    chevron: <path d="m8 4 8 8-8 8" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v1" />
      </>
    ),
    map: (
      <>
        <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zm6-2v16m6-14v16" />
      </>
    ),
    health: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
    bomb: (
      <>
        <rect x="5" y="7" width="14" height="14" rx="2" />
        <path d="M9 7V4h6l2-2M8 11h8m-8 4h2m4 0h2m-8 3h2m4 0h2" />
      </>
    ),
    skull: (
      <>
        <path d="M6 17c-5-7-1-15 6-15s11 8 6 15h-2v4H8v-4z" />
        <path d="M8 10h1v3H7v-2m8-1h1v3h-2v-2m-3 7h2m-1-4v2" />
      </>
    ),
    reload: (
      <>
        <path d="M20 9A8 8 0 1 0 19 17M20 3v6h-6" />
      </>
    ),
    play: <path d="m8 4 12 8-12 8z" />,
    check: <path d="m5 12 4 4L20 5" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v5m0 12v5M1 12h5m12 0h5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.crosshair}
    </svg>
  );
}

export function WeaponDrawing({
  id,
  className = "",
  style,
}: {
  id: WeaponId;
  className?: string;
  style?: CSSProperties;
}) {
  const pistol = ["glock", "usp", "deagle"].includes(id);
  return (
    <svg
      viewBox="0 0 180 64"
      fill="currentColor"
      className={`weapon-drawing ${className}`}
      style={style}
      aria-hidden="true"
    >
      {id === "knife" ? (
        <>
          <path d="m16 38 53-8 7 13-54 9zM74 25l9-2 9 27-9 3zM84 27l77-16-28 30-43 4z" />
          <path d="m92 29 54-12-20 14z" opacity=".3" />
        </>
      ) : pistol ? (
        <>
          <path
            d={`M${id === "usp" ? 25 : 40} 19h91l8 8-4 13-45 1-11 21H55l5-27H40z`}
          />
          <path d="M85 38h20v14H82v-5h16v-6H85z" />
          {id === "usp" && <path d="M11 19h40v12H11z" />}
          <path d="M115 15h8v6h-8M50 15h8v6h-8" />
        </>
      ) : (
        <>
          <path d="M7 24h43l9-7h45l5 5h35v9h-37l-8 6H64l-6 20H45l3-22H31l-9 13H9z" />
          <path d="M139 23h31v5h-31m28-7h7v10h-7M59 35h15l4 23H61z" />
          {id === "ak47" ? (
            <>
              <path d="m78 34 15-1 9 22-8 8-10-9z" />
              <path d="M108 21h29v13h-29z" />
            </>
          ) : id === "awp" ? (
            <>
              <path d="M58 7h49v8H58zM53 5h10v12H53m49-14h11v15h-11M70 14h7v8h-7m19-8h7v8h-7M112 22h45v6h-45" />
              <path d="M18 21h30v9H18z" />
            </>
          ) : (
            <>
              <path d="M61 12h44v6H61m47 7h31v8h-31M78 34h16v25H78z" />
              <path d="M124 15h4v12h-4" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
