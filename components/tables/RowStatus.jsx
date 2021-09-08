import { Box } from "@chakra-ui/react";

const RowStatus = ({ rowState }) => {
  return (
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
};

export default RowStatus;
