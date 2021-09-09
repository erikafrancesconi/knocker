import { useState, useEffect } from "react";
import { useDocker } from "hooks/useDocker";

import { Layout, Widget } from "components";
import { Flex } from "@chakra-ui/react";

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
        <Widget
          title="Containers"
          link="/docker/containers"
          data={{
            green: `${containers.running} running`,
            red: `${containers.stopped} stopped`,
          }}
        />
        <Widget
          title="Volumes"
          link="/docker/volumes"
          data={{
            green: `${volumes.used} used`,
            red: `${volumes.dangling} dangling`,
          }}
        />
      </Flex>
    </Layout>
  );
};

export default Home;
