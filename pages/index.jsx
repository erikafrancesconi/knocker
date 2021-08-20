import { useEffect, useState } from "react";

import { useModal } from "hooks/useModal";
import { useDocker } from "hooks/useDocker";

import { Layout, DataTable, Console } from "components";

import {
  useDisclosure,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const Home = () => {
  const [data, setData] = useState({ running: [], exited: [] });

  const toast = useToast();

  const { openModal, modalContent, modalTitle, appendContent } = useModal();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { listContainers, startContainer, stopContainer, removeContainer } =
    useDocker();

  const openConsole = (title) => {
    openModal(title);
    onOpen();
  };

  const tableTitles = [
    "Container ID",
    "Image",
    "Created",
    "Status",
    "Ports",
    "Names",
  ];

  const fetchDataFromAPI = async (all = false, exited = false) => {
    try {
      const result = await listContainers(all, exited);

      if (!exited) {
        setData((data) => ({
          running: result.filter((row) => row.State !== "exited"),
          exited: data.exited,
        }));
      }
      if (exited || all) {
        setData((data) => ({
          running: data.running,
          exited: result.filter((row) => row.State === "exited"),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI({ all: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLogs = async (containerId, containerName) => {
    openConsole(containerName);

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
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
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
        fetchDataFromAPI({ exited: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Dashboard">
      <Console
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={modalTitle}
      >
        {modalContent}
      </Console>

      <Tabs variant="enclosed-colored">
        <TabList>
          <Tab>Running</Tab>
          <Tab>Stopped</Tab>
        </TabList>

        <TabPanels pt={2}>
          <TabPanel>
            <DataTable
              title="Running containers"
              columns={tableTitles}
              rows={data.running}
              refreshData={() => fetchDataFromAPI()}
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
                    fetchDataFromAPI({ all: true });
                  },
                },
              ]}
            />
          </TabPanel>
          <TabPanel>
            <DataTable
              title="Stopped containers"
              columns={tableTitles}
              rows={data.exited}
              refreshData={() => fetchDataFromAPI({ exited: true })}
              deleteData={pruneStoppedContainers}
              functions={[
                {
                  title: "Start",
                  tooltip: "Start Container",
                  onClick: startContainer,
                  color: "green",
                  callback: () => {
                    fetchDataFromAPI({ all: true });
                  },
                },
                {
                  title: "Remove",
                  tooltip: "Remove Container",
                  onClick: removeContainer,
                  color: "red",
                  callback: () => fetchDataFromAPI({ exited: true }),
                },
              ]}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Home;
