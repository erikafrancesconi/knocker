import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  Box,
  Spacer,
  Button,
  Stack,
} from "@chakra-ui/react";

const DataTable = ({
  title,
  columns = [],
  rows = [],
  refreshData = () => {},
  deleteData,
  functions = [],
}) => {
  let btnDelete = null;
  if (deleteData) {
    btnDelete = (
      <Button
        colorScheme="red"
        title="Prune all stopped containers"
        onClick={deleteData}
        size="sm"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    );
  }

  return (
    <>
      <Flex>
        <Heading as="h3" size="md" color="blue.400" paddingBottom={4}>
          {title}
        </Heading>
        <Spacer />
        <Box>
          <Stack direction="row" spacing={4} align="center">
            <Button
              colorScheme="green"
              title="Refresh"
              onClick={refreshData}
              size="sm"
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
            </Button>
            {btnDelete}
          </Stack>
        </Box>
      </Flex>
      <Box py={4}>
        <Table variant="striped" size="sm">
          <Thead borderTopColor="gray.100" borderTopWidth={0.5}>
            <Tr>
              <Th p={6}></Th>
              {columns.length > 0 &&
                columns.map((h, idx) => <Th key={idx}>{h}</Th>)}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.length > 0 &&
              rows.map((d, idx) => (
                <Tr key={idx}>
                  <Td>
                    <Box
                      display="inline-block"
                      width={6}
                      height={6}
                      borderRadius="full"
                      backgroundColor={
                        d[3].trim().startsWith("Up")
                          ? "green.400"
                          : d[3].trim().startsWith("Exited")
                          ? "red.400"
                          : "yellow.400"
                      }
                    ></Box>
                  </Td>
                  {d.map((cell, idx) => (
                    <Td
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: cell.trim(),
                      }}
                    ></Td>
                  ))}
                  <Td>
                    <Stack direction="row" spacing={2} align="center">
                      {functions.map((f, idx) => (
                        <Button
                          key={idx}
                          colorScheme={f.color}
                          title={f.tooltip}
                          onClick={() => f.onClick(d[0], d[5], f.callback)}
                          size="xs"
                        >
                          {f.title}
                        </Button>
                      ))}
                    </Stack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default DataTable;
