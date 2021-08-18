import { readFile } from "fs/promises";
import YAML from "yaml";

import configData from "config/dockerfiles.json";

import { useModal } from "hooks/useModal";
import { Layout, Console, ConfigRow } from "components";
import {
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";

const Configurations = ({ data = [] }) => {
  const toast = useToast();

  const { openModal, modalContent, modalTitle, appendContent } = useModal();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openConsole = (title) => {
    openModal(title);
    onOpen();
  };

  const runConfiguration = async (name, filepath, compose, servizi) => {
    const api = `/api/docker/${compose ? "compose/up" : ""}`;

    openConsole(name);

    try {
      const res = await fetch(api, {
        method: "POST",
        body: JSON.stringify({ filepath, servizi }),
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

  return (
    <Layout title="Configurations">
      <Console
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={modalTitle}
      >
        {modalContent}
      </Console>
      <Table variant="simple">
        <Thead borderTopColor="gray.100" borderTopWidth={0.5}>
          <Tr>
            <Th>Name</Th>
            <Th>File</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length > 0 &&
            data.map((d, idx) => (
              <ConfigRow key={idx} data={d} run={runConfiguration} />
            ))}
        </Tbody>
      </Table>
    </Layout>
  );
};

export const getStaticProps = async () => {
  let data = [];

  try {
    data = await Promise.all(
      configData.map(async (row) => {
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
  }

  return {
    props: { data },
  };
};

export default Configurations;
