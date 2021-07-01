import React from "react";
import Head from "next/head";
import { execute } from "utils/server/process";

export default function Home({ headers, data }) {
  return (
    <React.Fragment>
      <Head>
        <title>Knocker - Docker interface powered by NextJS</title>
        <meta name="description" content="Docker interface powered by NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Knocker</h1>
      </header>
      <main>
        <h2>Running processes</h2>
        <table>
          <thead>
            <tr>
              {headers.length > 0 &&
                headers.map((h, idx) => <th key={idx}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((d, idx) => (
                <tr key={idx}>
                  {d.map((cell, idx) => (
                    <td key={idx}>{cell}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </React.Fragment>
  );
}

export const getServerSideProps = async (context) => {
  let headers = [],
    data = [];

  try {
    const res = await execute("docker ps");
    const rows = res
      .split("\n")
      .map((row) => row.split("  ").filter((r) => r !== ""))
      .filter((row) => row.length > 0);

    headers = rows[0];
    data = rows.filter((row, idx) => idx > 0);
  } catch (err) {
    console.errror(err);
  }

  return {
    props: { headers, data },
  };
};
