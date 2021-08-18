import {
  Flex,
  Text,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { default as NextLink } from "next/link";
import { useRouter } from "next/router";

const MobileNav = ({ items = [] }) => {
  const router = useRouter();

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      {items.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack onClick={children && onToggle}>
      <NextLink href={href ?? "#"}>
        <Flex
          py={2}
          as={Link}
          href={href ?? "#"}
          justify={"space-between"}
          align={"center"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text
            fontWeight={600}
            color={router.asPath === href ? "blue.400" : ""}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Flex>
      </NextLink>

      <Collapse
        in={isOpen}
        animateOpacity
        style={{ marginTop: "0 !important" }}
      >
        <Stack
          mt={0}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <NextLink href={child.href} key={child.label}>
                <Link
                  py={2}
                  href={child.href}
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  {child.label}
                </Link>
              </NextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default MobileNav;
