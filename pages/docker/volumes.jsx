import { Page } from "components";
import { useDocker } from "hooks/useDocker";
import { useVolume } from "hooks/useVolume";

const Volumes = () => {
  const { listVolumes } = useDocker();
  const { columns, btnDelete, menuRemove } = useVolume();

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
        },
        {
          tabTitle: "Dangling",
          resultPart: "dangling",
          title: "Dangling volumes",
          columns: columns,
          rowState: () => "exited",
          functions: [menuRemove],
          additionalButtons: [btnDelete],
        },
      ]}
      rowId="Name"
    />
  );
};

export default Volumes;
