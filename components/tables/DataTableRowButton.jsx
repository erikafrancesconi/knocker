import { Button } from "@chakra-ui/react";
import { useState } from "react";

const DataTableRowButton = ({ color, title, tooltip, clickHandler }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    // setIsLoading(true);
    clickHandler();
  };

  return (
    <Button
      isLoading={isLoading}
      colorScheme={color}
      title={tooltip}
      onClick={onClick}
      size="xs"
    >
      {title}
    </Button>
  );
};

export default DataTableRowButton;
