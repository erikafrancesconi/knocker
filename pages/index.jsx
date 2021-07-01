import React from "react";
import Layout from "components/Layout";

import { execute } from "utils/server/process";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];

export default function Home({ headers, data }) {
  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 pb-4">
        Running Processes
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
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
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
  } catch (err) {
    console.errror(err);
  }

  return {
    props: { headers, data },
  };
};
