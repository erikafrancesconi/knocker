import { ViewIcon, DeleteIcon } from "@chakra-ui/icons";
import { Page } from "components";
import { useDocker } from "hooks/useDocker";
import { readableDate } from "utils/client";

const Volumes = () => {
  const { listVolumes } = useDocker();

  const columns = {
    Name: {},
    CreatedAt: { title: "Created", formatter: readableDate },
    Driver: {},
  };

  const btnDelete = {
    color: "red",
    title: "Prune all unused volumes",
    action: () => {},
    icon: (
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    confirm: true,
    confirmData: {
      title: "Prune unused volumes",
      body: "Are you sure you want to remove all unused volumes? Removing volumes may result in data loss!",
      actionTitle: "Remove",
      action: () => {
        console.log("Fake pruning");
      },
    },
  };

  return (
    <Page
      title="Volumes"
      fetchFunction={listVolumes}
      tabs={[
        {
          tabTitle: "In Use",
          resultPart: "used",
          title: "Used volumes",
          columns: columns,
          rowState: () => "running",
          functions: [
            {
              title: "Inspect",
              onClick: () => {},
              icon: <ViewIcon />,
            },
          ],
        },
        {
          tabTitle: "Dangling",
          resultPart: "dangling",
          title: "Dangling volumes",
          columns: columns,
          rowState: () => "exited",
          functions: [
            {
              title: "Remove",
              onClick: () => {},
              icon: <DeleteIcon />,
              callback: true,
            },
          ],
          additionalButtons: [btnDelete],
        },
      ]}
      rowId="Name"
    />
  );
};

export default Volumes;
