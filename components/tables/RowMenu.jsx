import { Fragment } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const RowMenu = ({ rowId, rowName, functions, confirmAndRun }) => {
  return (
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
          <Fragment key={idx}>
            {f.separatorBefore && <MenuDivider />}
            <MenuItem
              icon={f.icon}
              onClick={
                f.confirm
                  ? () => confirmAndRun(f.confirmData, rowName, f.callback)
                  : () => f.onClick(rowId, rowName)
              }
            >
              {f.title}
            </MenuItem>
          </Fragment>
        ))}
      </MenuList>
    </Menu>
  );
};

export default RowMenu;
