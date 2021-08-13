import { useEffect, useState } from "react";

import { useToasts } from "react-toast-notifications";

import { Tab } from "@headlessui/react";

import { useModal } from "hooks/useModal";
import { useDocker } from "hooks/useDocker";

import { Layout, Table, Modal } from "components";

const Home = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState({ running: [], exited: [] });

  const { addToast } = useToasts();

  const {
    modalOpen,
    openModal,
    closeModal,
    modalContent,
    modalTitle,
    appendContent,
  } = useModal();

  const { startContainer, stopContainer, removeContainer } = useDocker();

  const fetchData = async (options = "") => {
    try {
      const res = await fetch("/api/docker/ps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ options }),
      });

      const { result } = await res.json();

      let rows = result
        .split("\n")
        .map((row) => row.split("  ").filter((r) => r !== ""))
        .filter((row) => row.length > 0);

      rows[0].splice(2, 1); // Command is useless
      setHeaders(rows[0]);

      rows = rows.filter((row, idx) => idx > 0);
      rows.forEach((d) => {
        if (!d[4].trim().startsWith("Up") || d.length < 7) {
          // Inserting white element for ports if process is not up
          d.splice(5, 0, "");
        }
        d[5] = d[5].split(",").join("<br />");
        d.splice(2, 1); // Command is useless
      });
      if (!options) {
        setData((data) => ({ running: rows, exited: data.exited }));
      } else {
        setData((data) => ({ running: data.running, exited: rows }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData("");
    fetchData('--all --filter "status=exited"');
  }, []);

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

  const pruneStoppedContainers = async () => {
    try {
      const res = await fetch("/api/docker/containerprune", {
        method: "POST",
      });

      const { result } = await res.json();
      if (result === "OK") {
        fetchData('--all --filter "status=exited"');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Layout title="Dashboard">
      <Modal onClose={() => closeModal()} show={modalOpen} title={modalTitle}>
        {modalContent}
      </Modal>
      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                "text-sm font-medium rounded-t-lg border-t border-l border-r px-4 py-2",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected ? "bg-blue-700 text-white" : "text-blue-700 "
              )
            }
          >
            Containers
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "text-sm font-medium rounded-t-lg border-t border-l border-r px-4 py-2",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected ? "bg-blue-700 text-white" : "text-blue-700 "
              )
            }
          >
            Volumes
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <div className="mb-16">
              <Table
                title="Running containers"
                columns={headers}
                rows={data.running}
                refreshData={() => fetchData("")}
                functions={[
                  {
                    title: "Logs",
                    tooltip: "Show Logs",
                    onClick: showLogs,
                    color: "blue",
                    callback: () => {},
                  },
                  {
                    title: "Stop",
                    tooltip: "Stop Container",
                    onClick: stopContainer,
                    color: "red",
                    callback: () => {
                      fetchData("");
                      fetchData('--all --filter "status=exited"');
                    },
                  },
                ]}
              />
            </div>
            <div>
              <Table
                title="Stopped containers"
                columns={headers}
                rows={data.exited}
                refreshData={() => fetchData('--all --filter "status=exited"')}
                deleteData={pruneStoppedContainers}
                functions={[
                  {
                    title: "Start",
                    tooltip: "Start Container",
                    onClick: startContainer,
                    color: "green",
                    callback: () => {
                      fetchData("");
                      fetchData('--all --filter "status=exited"');
                    },
                  },
                  {
                    title: "Remove",
                    tooltip: "Remove Container",
                    onClick: removeContainer,
                    color: "red",
                    callback: () => fetchData('--all --filter "status=exited"'),
                  },
                ]}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};

export default Home;
