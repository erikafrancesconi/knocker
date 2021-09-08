import { Button } from "@chakra-ui/react";

const GenericDataTableButtons = ({
  refreshData,
  additionalButtons,
  confirmAndRun,
}) => {
  return (
    <>
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
    </>
  );
};

export default GenericDataTableButtons;
