import {
  Box,
  Text,
  Stack,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { default as NextLink } from "next/link";
import { useRouter } from "next/router";

const DesktopNav = ({ items = [] }) => {
  const router = useRouter();

  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={6}>
      {items.map((navItem) => (
        <Box key={navItem.label}>
          {!navItem.children || navItem.children.length === 0 ? (
            <NextLink href={navItem.href ?? "/"}>
              <Link
                href={navItem.href ?? "/"}
                color={router.asPath === navItem.href ? "blue.400" : ""}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </NextLink>
          ) : (
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <Link
                  href={navItem.href ?? "#"}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  <Stack direction={"row"} align={"center"}>
                    <Box>
                      <Text
                        transition={"all .3s ease"}
                        _groupHover={{ color: "blue.400" }}
                        fontWeight={500}
                      >
                        {navItem.label}
                      </Text>
                    </Box>

                    <Icon color={"blue.400"} w={5} h={5} as={ChevronDownIcon} />
                  </Stack>
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          )}
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const router = useRouter();

  return (
    <NextLink href={href}>
      <Link
        href={href}
        role={"group"}
        display={"block"}
        p={2}
        rounded={"md"}
        _hover={{ bg: useColorModeValue("blue.50", "gray.900") }}
        color={router.asPath === href ? "blue.400" : ""}
      >
        <Stack direction={"row"} align={"center"}>
          <Box>
            <Text
              transition={"all .3s ease"}
              _groupHover={{ color: "blue.400" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={"sm"}>{subLabel}</Text>
          </Box>
        </Stack>
      </Link>
    </NextLink>
  );
};

export default DesktopNav;
