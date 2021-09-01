import { useCallback, Fragment } from "react";

import { useTable, useExpanded, useSortBy } from "react-table";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Code,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const AdvancedTable = ({ columns, data, expandedData }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy, useExpanded);

  // Create a function that will render our row sub components
  const renderRowSubComponent = useCallback(
    ({ row }) => {
      return (
        <pre>
          <Code backgroundColor="transparent" fontSize="xs">
            {JSON.stringify(expandedData[row.values.col2], null, 2)}
          </Code>
        </pre>
      );
    },
    [expandedData]
  );

  return (
    <Table variant="striped" size="sm" {...getTableProps()}>
      <Thead borderTopColor="gray.100" borderTopWidth={0.5}>
        {headerGroups.map((headerGroup, idx) => (
          <Tr key={idx} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, idx1) => (
              <Th
                key={idx1}
                py={4}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <Fragment key={idx}>
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell, idx1) => (
                  <Td
                    key={idx1}
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
              {row.isExpanded ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    {renderRowSubComponent({ row })}
                  </Td>
                </Tr>
              ) : null}
            </Fragment>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default AdvancedTable;
