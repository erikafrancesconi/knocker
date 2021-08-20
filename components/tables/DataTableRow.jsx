import { Tr, Td, Box, Button, Stack, Text } from "@chakra-ui/react";

import { getElapsedTime } from "utils/client";

const DataTableRow = ({ data = {}, functions = [] }) => {
  const Id = data.Id.substring(0, 12);

  const { Image, Created, Status, Ports, Names, State } = data;

  return (
    <Tr>
      <Td>
        <Box
          display="inline-block"
          width={6}
          height={6}
          borderRadius="full"
          backgroundColor={
            State === "running"
              ? "green.400"
              : State === "exited"
              ? "red.400"
              : "yellow.400"
          }
        ></Box>
      </Td>
      <Td>{Id}</Td>
      <Td>{Image}</Td>
      <Td>{getElapsedTime(Created)}</Td>
      <Td>{Status}</Td>
      <Td>
        {Ports.map((port, idx) => {
          const { Type, PrivatePort, PublicPort } = port;
          return (
            <Text key={idx}>{`${Type}:${PrivatePort}${
              typeof PublicPort !== "undefined" ? `->${PublicPort}` : ""
            }`}</Text>
          );
        })}
      </Td>
      <Td>{Names.join(",")}</Td>
      <Td>
        <Stack direction="row" spacing={2} align="center">
          {functions.map((f, idx) => (
            <Button
              key={idx}
              colorScheme={f.color}
              title={f.tooltip}
              onClick={() => f.onClick(Id, Image, f.callback)}
              size="xs"
            >
              {f.title}
            </Button>
          ))}
        </Stack>
      </Td>
    </Tr>
  );
};

export default DataTableRow;
