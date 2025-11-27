import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title className="font-bold">Pizzaria Massa Nostra</title>
      <body className="dark overflow-x-clip">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
