import { useState, useRef, useMemo } from "react";

import {
  Heading,
  Flex,
  Box,
  Spacer,
  Button,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";

import { getElapsedTime } from "utils/client";
import AdvancedTable from "./AdvancedTable";

const DataTable = ({
  title,
  columns = [],
  rows = [],
  refreshData = () => {},
  deleteData,
  functions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  console.log(rows);

  const titles = useMemo(() => {
    const tmp = [];
    tmp.push({
      Header: "",
      id: "expander",
      Cell: function RowExpander({ row }) {
        return (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <TriangleUpIcon /> : <TriangleDownIcon />}
          </span>
        );
      },
    });
    tmp.push({ Header: "", accessor: "col1" });
    columns.forEach((column, idx) => {
      tmp.push({
        Header: column,
        accessor: `col${idx + 2}`,
      });
    });
    tmp.push({ Header: "", accessor: `col${tmp.length}` });
    return tmp;
  }, [columns]);

  const data = useMemo(() => {
    const tmp = [];
    rows.forEach((row, idx) => {
      const Id = row.Id.substring(0, 12);
      const { Image, Created, Status, Ports, Names, State } = row;

      const currRow = {};
      currRow.col1 = (
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
      );
      currRow.col2 = Id;
      currRow.col3 = Image;
      currRow.col4 = getElapsedTime(Created);
      currRow.col5 = Status;
      currRow.col6 = Ports.map((port, idx) => {
        const { Type, PrivatePort, PublicPort } = port;
        return (
          <Text key={idx}>{`${Type}:${PrivatePort}${
            typeof PublicPort !== "undefined" ? `->${PublicPort}` : ""
          }`}</Text>
        );
      });
      currRow.col7 = Names.join(",");
      currRow.col8 = (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
            size="xs"
          >
            Actions
          </MenuButton>
          <MenuList>
            {functions.map((f, idx) => (
              <>
                {f.separatorBefore && <MenuDivider />}
                <MenuItem
                  key={idx}
                  icon={f.icon}
                  onClick={() => f.onClick(Id, Image, f.callback)}
                >
                  {f.title}
                </MenuItem>
              </>
            ))}
          </MenuList>
        </Menu>
      );
      tmp.push(currRow);
    });
    return tmp;
  }, [rows, functions]);

  const expandedData = useMemo(() => {
    const tmpObj = {};
    rows.forEach((row) => {
      tmpObj[row.Id.substring(0, 12)] = { ...row };
    });
    return tmpObj;
  }, [rows]);

  let btnDelete = null;
  if (deleteData) {
    btnDelete = (
      <>
        <Button
          colorScheme="red"
          title="Prune all stopped containers"
          onClick={() => setIsOpen(true)}
          size="sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
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
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered={true}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Prune containers
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to remove all stopped containers?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteData();
                    onClose();
                  }}
                  ml={3}
                >
                  Remove
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Flex>
        <Heading as="h3" size="md" color="blue.400" fontWeight="normal">
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
                width="1.5rem"
                height="1.5rem"
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
        <AdvancedTable
          columns={titles}
          data={data}
          expandedData={expandedData}
        />
      </Box>
    </>
  );
};

export default DataTable;
