import React from "react";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";

import Layout from "components/Layout";

import { execute } from "utils/server/process";

export default function Home({ headers, data }) {
  const router = useRouter();
  const { addToast } = useToasts();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const stopContainer = async (containerId) => {
    containerId = containerId.trim();

    try {
      const res = await fetch("/api/docker/stop", {
        method: "POST",
        body: JSON.stringify({ containerId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { result } = await res.json();
      if (result.replaceAll("\n", "") === containerId) {
        addToast(`Container ${containerId} stopped.`, {
          appearance: "success",
        });
        refreshData();
      }
    } catch (err) {
      addToast("Something went wrong.", {
        appearance: "error",
      });
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 pb-4 flex justify-between">
        Running Processes
        <button
          className="bg-green-600 hover:bg-green-800 text-white p-2 rounded righ"
          title="Refresh"
          onClick={refreshData}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </h2>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.length > 0 &&
                      headers.map((h, idx) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          key={idx}
                        >
                          {h}
                        </th>
                      ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 &&
                    data.map((d, idx) => (
                      <tr key={idx}>
                        {d.map((cell, idx) => (
                          <td
                            key={idx}
                            className="px-6 py-4 text-sm text-gray-800"
                          >
                            {cell}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="bg-red-700 hover:bg-red-500 rounded-md inline-flex items-center p-1"
                            title="Stop"
                            onClick={() => stopContainer(d[0])}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
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
    data.forEach((d) => console.log(d.length));
  } catch (err) {
    console.errror(err);
  }

  return {
    props: { headers, data },
  };
};
