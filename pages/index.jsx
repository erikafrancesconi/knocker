import { useDocker } from "hooks/useDocker";
import Link from "next/link";

import { Layout } from "components";

import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon, WarningIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const Home = () => {
  const [containers, setContainers] = useState({ running: 0, stopped: 0 });

  const { listContainers } = useDocker();

  const fetchData = async () => {
    try {
      const res = await listContainers(true);
      const running = res.filter((row) => row.State !== "exited").length;
      const stopped = res.filter((row) => row.State === "exited").length;
      setContainers({ running, stopped });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="Dashboard">
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={6}
      >
        <Heading as="h3" size="md" color="blue.400" mb="2" fontWeight="normal">
          <Link href="/docker/containers">
            <a>
              Containers <LinkIcon w={4} h={4} />
            </a>
          </Link>
        </Heading>
        <Text mt="1">
          <CheckCircleIcon color="green" mr="2" />
          {containers.running} running
        </Text>
        <Text mt="1">
          <WarningIcon color="red" mr="2" />
          {containers.stopped} stopped
        </Text>
      </Box>
    </Layout>
  );
};

export default Home;
