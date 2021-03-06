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
import {
  AttachmentIcon,
  CheckCircleIcon,
  CopyIcon,
  DeleteIcon,
  InfoOutlineIcon,
  RepeatClockIcon,
} from "@chakra-ui/icons";
import { copyToClipboard } from "utils/client";

const Containers = () => {
  const [data, setData] = useState({ running: [], exited: [] });

  const toast = useToast();

  const { openModal, modalContent, modalTitle, appendContent } = useModal();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    listContainers,
    startContainer,
    stopContainer,
    removeContainer,
    restartContainer,
  } = useDocker();

  const openConsole = (title) => {
    openModal(title);
    onOpen();
  };

  const tableTitles = [
    "Container ID",
    "Image",
    "Created",
    "Status",
    "IP",
    "Ports",
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APIURL}${process.env.NEXT_PUBLIC_APIVERSION}/containers/${containerId}/logs?stdout=true&stderr=true&follow=true`
      );
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APIURL}${process.env.NEXT_PUBLIC_APIVERSION}/containers/prune`,
        {
          method: "POST",
        }
      );

      const { ContainersDeleted, SpaceReclaimed } = await res.json();
      toast({
        title: `${ContainersDeleted.length} containers removed`,
        description: `${SpaceReclaimed} bytes of space reclaimed`,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      fetchDataFromAPI({ exited: true });
    } catch (err) {
      console.error(err);
    }
  };

  const attachShell = async (containerId) => {
    await copyToClipboard(`docker exec -it ${containerId} sh`);
    toast({
      title: "Copied!",
      description:
        "Command has been copied to your clipboard. Just paste in a shell. Type exit in the shell when you are done.",
      status: "info",
      duration: 9000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Layout title="Containers">
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
                  title: "Attach Shell",
                  onClick: attachShell,
                  icon: <AttachmentIcon />,
                },
                {
                  title: "Restart",
                  onClick: restartContainer,
                  icon: <RepeatClockIcon />,
                },
                {
                  title: "View Logs",
                  onClick: showLogs,
                  icon: <CopyIcon />,
                },
                {
                  title: "Stop Container",
                  onClick: stopContainer,
                  icon: <DeleteIcon />,
                  callback: () => {
                    fetchDataFromAPI({ all: true });
                  },
                  separatorBefore: true,
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
                  title: "Start Container",
                  onClick: startContainer,
                  icon: <CheckCircleIcon />,
                  callback: () => {
                    fetchDataFromAPI({ all: true });
                  },
                },
                {
                  title: "View Logs",
                  onClick: showLogs,
                  icon: <InfoOutlineIcon />,
                },
                {
                  title: "Remove Container",
                  onClick: removeContainer,
                  icon: <DeleteIcon />,
                  callback: () => fetchDataFromAPI({ exited: true }),
                  separatorBefore: true,
                },
              ]}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Containers;
