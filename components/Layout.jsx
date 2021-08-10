import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Nav from "./Nav";

const navigation = [
  { title: "Dashboard", url: "/" },
  { title: "Configurations", url: "/config" },
];

const Layout = ({ title = "", children }) => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Knocker - Docker interface powered by NextJS</title>
        <meta name="description" content="Docker interface powered by NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav navigation={navigation} />

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
