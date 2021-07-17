import React, { useEffect, useState } from "react";

import { useToasts } from "react-toast-notifications";

import { useModal } from "hooks/useModal";

import Layout from "components/Layout";
import Table from "components/Table";
import Modal from "components/Modal";

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
        fetchData("");
      }
    } catch (err) {
      console.error(err);
      addToast("Something went wrong.", {
        appearance: "error",
      });
    }
  };

  const removeContainer = async (containerId, containerName) => {
    containerId = containerId.trim();

    try {
      const res = await fetch("/api/docker/rm", {
        method: "POST",
        body: JSON.stringify({ containerId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { result } = await res.json();
      if (result.replaceAll("\n", "") === containerId) {
        addToast(`Container ${containerName} removed.`, {
          appearance: "success",
        });
        fetchData('--all --filter "status=exited"');
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
    <Layout>
      <Modal onClose={() => closeModal()} show={modalOpen} title={modalTitle}>
        {modalContent}
      </Modal>
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
            },
            {
              title: "Stop",
              tooltip: "Stop Container",
              onClick: stopContainer,
              color: "red",
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
          functions={[
            {
              title: "Remove",
              tooltip: "Remove Container",
              onClick: removeContainer,
              color: "red",
            },
          ]}
        />
      </div>
    </Layout>
  );
};

export default Home;
