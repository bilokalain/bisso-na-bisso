import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B5E3F",
          color: "#FBF7F0",
          fontSize: 340,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Georgia, serif",
          borderRadius: 96,
        }}
      >
        B<span style={{ color: "#D4A62A" }}>.</span>
      </div>
    ),
    size,
  );
}
