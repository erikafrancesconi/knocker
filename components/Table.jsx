import React from "react";

import { useModal } from "hooks/useModal";
import { useToasts } from "react-toast-notifications";

import Modal from "components/Modal";

const Table = ({ title, columns = [], rows = [], refreshData = () => {} }) => {
  const {
    modalOpen,
    openModal,
    closeModal,
    modalContent,
    modalTitle,
    appendContent,
  } = useModal();

  const { addToast } = useToasts();

  const stopContainer = async (containerId, containerName) => {
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
        addToast(`Container ${containerName} stopped.`, {
          appearance: "success",
        });
        refreshData();
      }
    } catch (err) {
      console.error(err);
      addToast("Something went wrong.", {
        appearance: "error",
      });
    }
  };

  const showLogs = async (containerId, containerName) => {
    openModal(containerName);

    try {
      const res = await fetch("/api/docker/logs", {
        method: "POST",
        body: JSON.stringify({ containerId: containerId.trim() }),
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

  return (
    <>
      <Modal onClose={() => closeModal()} show={modalOpen} title={modalTitle}>
        {modalContent}
      </Modal>
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
                    <th></th>
                    {columns.length > 0 &&
                      columns.map((h, idx) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          key={idx}
                        >
                          {h}
                        </th>
                      ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Functionalities</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.length > 0 &&
                    rows.map((d, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 align-top">
                          {d[3].trim().startsWith("Up") ? (
                            <span className="rounded-full h-6 w-6 flex items-center justify-center bg-green-400"></span>
                          ) : (
                            <span className="rounded-full h-6 w-6 flex items-center justify-center bg-yellow-400"></span>
                          )}
                        </td>
                        {d.map((cell, idx) => (
                          <td
                            key={idx}
                            className="px-6 py-2 text-sm text-gray-800 align-top"
                            dangerouslySetInnerHTML={{
                              __html: cell.trim(),
                            }}
                          ></td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                          <button
                            className="bg-blue-800 hover:bg-blue-500 rounded-md inline-flex items-center py-1 px-2 text-white mr-1"
                            title="Show Logs"
                            onClick={() => showLogs(d[0], d[5])}
                          >
                            Logs
                          </button>
                          <button
                            className="bg-red-700 hover:bg-red-500 rounded-md inline-flex items-center py-1 px-2 text-white"
                            title="Stop"
                            onClick={() => stopContainer(d[0], d[5])}
                          >
                            Stop
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
    </>
  );
};

export default Table;