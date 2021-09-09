import { useDocker } from "hooks/useDocker";
import Link from "next/link";

import { Layout } from "components";

import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon, WarningIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const Home = () => {
  const [containers, setContainers] = useState({ running: 0, stopped: 0 });
  const [volumes, setVolumes] = useState({ used: 0, dangling: 0 });

  const { listContainers, listVolumes } = useDocker();

  const fetchData = async () => {
    try {
      const res = await listContainers(true);
      const running = res.filter((row) => row.State !== "exited").length;
      const stopped = res.filter((row) => row.State === "exited").length;
      setContainers({ running, stopped });

      const resv = await listVolumes();
      const used = resv.used.length;
      const dangling = resv.dangling.length;
      setVolumes({ used, dangling });
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
      <Flex>
        <Box
          w="300px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={6}
          mr={4}
        >
          <Heading
            as="h3"
            size="md"
            color="blue.400"
            mb="2"
            fontWeight="normal"
          >
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
        <Box
          w="300px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={6}
          mr={4}
        >
          <Heading
            as="h3"
            size="md"
            color="blue.400"
            mb="2"
            fontWeight="normal"
          >
            <Link href="/docker/volumes">
              <a>
                Volumes <LinkIcon w={4} h={4} />
              </a>
            </Link>
          </Heading>
          <Text mt="1">
            <CheckCircleIcon color="green" mr="2" />
            {volumes.used} used
          </Text>
          <Text mt="1">
            <WarningIcon color="red" mr="2" />
            {volumes.dangling} dangling
          </Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Home;
