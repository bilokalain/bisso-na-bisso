import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1D2E5E",
          color: "#FBF7F0",
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Georgia, serif",
        }}
      >
        B<span style={{ color: "#D4A62A" }}>.</span>
      </div>
    ),
    size,
  );
}
