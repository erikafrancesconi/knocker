import React from "react";
import Head from "next/head";
import Image from "next/image";

import {
  Box,
  Flex,
  IconButton,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { DesktopNav, MobileNav } from "components";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Docker",
    children: [
      {
        label: "Containers",
        href: "/docker/containers",
      },
      {
        label: "Volumes",
        href: "/docker/volumes",
      },
    ],
  },
  { label: "Configurations", href: "/config" },
];

const Layout = ({ title = "", children }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div>
      <Head>
        <title>Knocker - Docker interface powered by NextJS</title>
        <meta name="description" content="Docker interface powered by NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          align={"center"}
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Image
              src="/images/docker.svg"
              alt="Knocker"
              width={44}
              height={44}
            />
            <Flex
              display={{ base: "none", md: "flex" }}
              ml={10}
              alignItems="center"
            >
              <DesktopNav items={navigation} _ />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            {/* Eventuale contenuto a destra */}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav items={navigation} />
        </Collapse>
      </Box>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
