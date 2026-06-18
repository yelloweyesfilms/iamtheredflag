import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

export default function handler(req) {
  const { searchParams } = new URL(req.url, "https://iamtheredflag.com");
  const size = parseInt(searchParams.get("size") || "512");

  const flag = size >= 256 ? "128px" : "64px";
  const fontSize = size >= 256 ? "52px" : "28px";
  const textSize = size >= 256 ? "13px" : "8px";
  const showText = size >= 256;

  return new ImageResponse(
    (
      <div style={{ width: size, height: size, background: "#09090f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", width: size * 0.8, height: size * 0.8, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,92,58,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: size * 0.05, borderRadius: size * 0.18, border: "2px solid rgba(232,92,58,0.3)" }} />
        <div style={{ fontSize: flag, lineHeight: 1, marginBottom: showText ? "8px" : 0 }}>
          🚩
        </div>
        {showText && (
          <>
            <div style={{ fontSize, fontWeight: 900, color: "#E85C3A", letterSpacing: "-1px", fontFamily: "sans-serif" }}>
              RED FLAG
            </div>
            <div style={{ fontSize: textSize, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "3px", marginTop: "4px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
              I am the problem
            </div>
          </>
        )}
      </div>
    ),
    { width: size, height: size }
  );
}
