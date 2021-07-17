import { useToasts } from "react-toast-notifications";

export const useDocker = () => {
  const { addToast } = useToasts();

  const executeCommand = async (
    command,
    containerId,
    containerName,
    callback
  ) => {
    containerId = containerId.trim();

    try {
      const res = await fetch(`/api/docker/${command.command}`, {
        method: "POST",
        body: JSON.stringify({ containerId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { result } = await res.json();

      if (result.replaceAll("\n", "") === containerId) {
        addToast(`Container ${containerName} ${command.resok}.`, {
          appearance: "success",
        });
        callback();
        return "OK";
      }
    } catch (err) {
      console.error(err);
      addToast("Something went wrong.", {
        appearance: "error",
      });
      return "KO";
    }
  };

  const startContainer = async (containerId, containerName, callback) => {
    return await executeCommand(
      { command: "start", resok: "started" },
      containerId,
      containerName,
      callback
    );
  };

  const stopContainer = async (containerId, containerName, callback) => {
    return await executeCommand(
      { command: "stop", resok: "stopped" },
      containerId,
      containerName,
      callback
    );
  };

  const removeContainer = async (containerId, containerName, callback) => {
    return await executeCommand(
      { command: "rm", resok: "removed" },
      containerId,
      containerName,
      callback
    );
  };

  return {
    startContainer,
    stopContainer,
    removeContainer,
  };
};
