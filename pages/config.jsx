import Layout from "components/Layout";
import React from "react";

import { useToasts } from "react-toast-notifications";

import { connect } from "db";

const Configurations = ({ data }) => {
  const { addToast } = useToasts();

  const runConfiguration = async (filepath, compose) => {
    const api = `/api/docker/${compose ? "compose/up" : ""}`;

    try {
      const res = await fetch(api, {
        method: "POST",
        body: JSON.stringify({ filepath }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { result } = await res.json();

      if (result === "OK") {
        addToast("Command launched.", {
          appearance: "success",
        });
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
        Saved configurations
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded righ"
          title="New"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      File
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 &&
                    data.map((d, idx) => {
                      const { id, name, filepath, compose } = d;

                      return (
                        <tr key={idx}>
                          <td className="px-6 py-2 text-sm text-gray-800 align-top">
                            {name}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 align-top">
                            {filepath}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                            <button
                              className="bg-green-700 hover:bg-green-500 rounded-md inline-flex items-center py-1 px-2 text-white"
                              title="Stop"
                              onClick={() =>
                                runConfiguration(filepath, compose)
                              }
                            >
                              Run
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  let data = [];

  const client = await connect().catch((err) => {
    console.log("Unable to connect", err.stack);
    return {
      props: { data },
    };
  });

  try {
    const text = "SELECT * FROM configurations";
    const resp = await client.query(text);
    data = resp.rows;
  } catch (err) {
    console.error(err.stack);
  } finally {
    client.release();
  }

  return {
    props: { data },
  };
};

export default Configurations;
