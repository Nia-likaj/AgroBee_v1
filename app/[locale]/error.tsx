"use client";

export default function GlobalError({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Ndodhi një gabim</h2>
        <p>{error?.message}</p>
      </body>
    </html>
  );
}
