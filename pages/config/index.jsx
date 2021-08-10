import { useState } from "react";

import Link from "next/link";
import router from "next/router";

import { readFile } from "fs/promises";
import YAML from "yaml";

import { useToasts } from "react-toast-notifications";
import { useModal } from "hooks/useModal";

import { connect } from "db";
import { Layout, Modal } from "components";

const Configurations = ({ data = [] }) => {
  const { addToast } = useToasts();

  const {
    modalOpen,
    openModal,
    closeModal,
    modalContent,
    modalTitle,
    appendContent,
  } = useModal();

  const [servicesObj, setServicesObj] = useState({});

  const updateServiceState = (e) => {
    const id = e.target.id.substring(0, e.target.id.indexOf("-"));
    const fieldName = e.target.name;
    setServicesObj({
      ...servicesObj,
      [id]: { ...servicesObj[id], [fieldName]: e.target.checked },
    });
  };

  const runConfiguration = async (name, filepath, compose) => {
    const api = `/api/docker/${compose ? "compose/up" : ""}`;

    openModal(name);

    try {
      const res = await fetch(api, {
        method: "POST",
        body: JSON.stringify({ filepath }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        appendContent(value.split("\n"));
      }
    } catch (err) {
      addToast("Something went wrong.", {
        appearance: "error",
      });
    }
  };

  const deleteConfiguration = async (id) => {
    const res = await fetch("/api/db/config/remove", {
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      router.push("/config");
    }
  };

  return (
    <Layout title="Configurations">
      <Modal onClose={() => closeModal()} show={modalOpen} title={modalTitle}>
        {modalContent}
      </Modal>
      <h2 className="text-2xl font-bold text-gray-800 pb-4 flex justify-between">
        Saved configurations
        {/* eslint-disable-next-line @next/next/link-passhref */}
        <Link href="/config/new">
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
        </Link>
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
                      const { id, name, filepath, compose, services } = d;
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-2 text-sm text-gray-900 align-top font-medium">
                            {name}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 align-top">
                            <div className="text-sm">{filepath}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {services.map((service, idx) => (
                                <span key={idx} className="mr-4 pb-1">
                                  <input
                                    type="checkbox"
                                    name={service}
                                    id={`${id}-${service}`}
                                    className="focus:ring-indigo-500 h-4 w-4 mr-1 mb-1 text-indigo-600 border-gray-300 rounded"
                                    onChange={updateServiceState}
                                    checked={
                                      typeof servicesObj[id] !== "undefined"
                                        ? servicesObj[id][service]
                                        : false
                                    }
                                  />
                                  <label htmlFor={`${id}-${service}`}>
                                    {service}
                                  </label>
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="bg-green-700 hover:bg-green-500 rounded-md inline-flex items-center py-1 px-2 mr-1 text-white"
                              title="Run Configuration"
                              onClick={() =>
                                runConfiguration(name, filepath, compose)
                              }
                            >
                              Run
                            </button>
                            <button
                              className="bg-red-700 hover:bg-red-500 rounded-md inline-flex items-center py-1 px-2 mr-1 text-white"
                              title="Delete Configuration"
                              onClick={() => deleteConfiguration(id)}
                            >
                              Delete
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
    const text = "SELECT * FROM configurations ORDER BY name";
    const resp = await client.query(text);

    data = await Promise.all(
      resp.rows.map(async (row) => {
        const services = [];
        if (row.filepath.endsWith(".yml")) {
          const file = await readFile(row.filepath, "utf-8");
          const yaml = YAML.parse(file);

          for (const service in yaml.services) {
            services.push(service);
          }
        }
        return { ...row, services };
      })
    );
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
