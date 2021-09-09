import Link from "next/link";
import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon, WarningIcon } from "@chakra-ui/icons";

const Widget = ({ title, link, data }) => {
  return (
    <Box
      w="300px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      mr={4}
    >
      <Heading as="h3" size="md" color="blue.400" mb="2" fontWeight="normal">
        <Link href={link}>
          <a>
            {title} <LinkIcon w={4} h={4} />
          </a>
        </Link>
      </Heading>
      <Text mt="1">
        <CheckCircleIcon color="green" mr="2" />
        {data.green}
      </Text>
      <Text mt="1">
        <WarningIcon color="red" mr="2" />
        {data.red}
      </Text>
    </Box>
  );
};

export default Widget;
