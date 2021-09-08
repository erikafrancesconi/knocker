import { useState, useRef, useMemo } from "react";

import { Heading, Flex, Box, Spacer, Stack } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import { Alert } from "components";
import { AdvancedTable, GenericDataTableButtons, RowMenu, RowStatus } from "./";

const GenericDataTable = (props) => {
  const { columns = [], rows = [], functions = [] } = props;
  const { refreshData = () => {}, additionalButtons = [] } = props;
  const { rowId, rowName, rowState = () => {} } = props;
  const { title } = props;

  // Configurazioni per gli alert
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
      currRow.col1 = <RowStatus rowState={rowState} />;

      let idx1 = 2;
      for (const column in columns) {
        currRow[`col${idx1}`] = columns[column].formatter
          ? columns[column].formatter(row[column])
          : row[column];
        idx1++;
      }

      currRow[`col${idx1}`] = (
        <RowMenu functions={functions} confirmAndRun={confirmAndRun} />
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
          <Alert
            isOpen={isOpen}
            cancelRef={cancelRef}
            onClose={onClose}
            alertData={alertData}
          />
          <Stack direction="row" spacing={4} align="center">
            <GenericDataTableButtons
              refreshData={refreshData}
              additionalButtons={additionalButtons}
              confirmAndRun={confirmAndRun}
            />
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
