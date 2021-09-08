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

import AdvancedTable from "./AdvancedTable";

const GenericDataTable = ({
  title,
  columns = [],
  rows = [],
  refreshData = () => {},
  additionalButtons = [],
  functions = [],
  rowId,
  rowName,
  rowState = () => {},
}) => {
  // Stato per gli alert
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [alertData, setAlertData] = useState({
    title: "",
    body: "",
    actionTitle: "",
    action: () => {},
  });
  const confirmAndRun = (data) => {
    setAlertData({ ...data });
    setIsOpen(true);
  };

  // Configurazioni React Table
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

    let idx = 2;
    for (const column in columns) {
      tmp.push({
        Header: columns[column].title || column,
        accessor: `col${idx}`,
      });
      idx++;
    }

    tmp.push({ Header: "", accessor: `col${tmp.length}` });

    return tmp;
  }, [columns]);

  const data = useMemo(() => {
    const tmp = [];

    rows.forEach((row, idx) => {
      const Id = row[rowId],
        Name = row[rowName] || row[rowId];

      const currRow = {};
      currRow.col1 = (
        <Box
          display="inline-block"
          width={6}
          height={6}
          borderRadius="full"
          backgroundColor={
            rowState() === "running"
              ? "green.400"
              : rowState() === "exited"
              ? "red.400"
              : "yellow.400"
          }
        ></Box>
      );

      let idx1 = 2;
      for (const column in columns) {
        currRow[`col${idx1}`] = columns[column].formatter
          ? columns[column].formatter(row[column])
          : row[column];
        idx1++;
      }

      currRow[`col${idx1}`] = (
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
                  onClick={() =>
                    f.onClick(
                      Id,
                      Name,
                      f.callback
                        ? () => {
                            console.log("Callback");
                          }
                        : () => {}
                    )
                  }
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
  }, [columns, rows, functions, rowId, rowState, rowName]);

  const expandedData = useMemo(() => {
    const tmpObj = {};
    rows.forEach((row) => {
      tmpObj[row[rowId]] = { ...row };
    });
    return tmpObj;
  }, [rows, rowId]);

  return (
    <>
      <Flex>
        <Heading as="h3" size="md" color="blue.400" fontWeight="normal">
          {title}
        </Heading>
        <Spacer />
        <Box>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered={true}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {alertData.title}
                </AlertDialogHeader>
                <AlertDialogBody>{alertData.body}</AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={alertData.action} ml={3}>
                    {alertData.actionTitle}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
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
            {additionalButtons.map((button, idx) => {
              return (
                <Button
                  key={idx}
                  colorScheme={button.color}
                  title={button.title}
                  onClick={
                    button.confirm
                      ? () => confirmAndRun(button.confirmData)
                      : button.action()
                  }
                  size="sm"
                >
                  {button.icon}
                </Button>
              );
            })}
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

export default GenericDataTable;
