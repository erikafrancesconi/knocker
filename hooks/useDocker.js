import { useToast } from "@chakra-ui/react";

export const useDocker = () => {
  const toast = useToast();

  const genericError = () => {
    toast({
      title: "Something went wrong",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top",
    });
    return "KO";
  };

  const listContainers = async (all = false, exited = false) => {
    const options = `${all || exited ? "all=true" : ""}${
      exited ? '&filters={"status":["exited"]}' : ""
    }`;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APIURL}${process.env.NEXT_PUBLIC_APIVERSION}/containers/json?${options}`
      );
      const result = await res.json();
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const executeContainerCommand = async (
    command,
    method,
    containerId,
    containerName,
    callback
  ) => {
    const progressMsg =
      command === "start"
        ? "Starting"
        : command === "stop"
        ? "Stopping"
        : command === "restart"
        ? "Restarting"
        : "Removing";
    toast({
      title: `${progressMsg} container ${containerName}...`,
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APIURL}${
          process.env.NEXT_PUBLIC_APIVERSION
        }/containers/${containerId}${command ? `/${command}` : ""}`,
        {
          method: method,
        }
      );
      if (res.status === 204) {
        const msg =
          command === "start"
            ? "started"
            : command === "stop"
            ? "stopped"
            : command === "restart"
            ? "restarted"
            : "removed";
        toast({
          title: `Container ${containerName} ${msg}.`,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });

        if (typeof callback !== "undefined") {
          callback();
        }
        return "OK";
      }
      return genericError();
    } catch (error) {
      console.error(error);
      return genericError();
    }
  };

  const startContainer = async (containerId, containerName, callback) => {
    return await executeContainerCommand(
      "start",
      "POST",
      containerId,
      containerName,
      callback
    );
  };

  const stopContainer = async (containerId, containerName, callback) => {
    return await executeContainerCommand(
      "stop",
      "POST",
      containerId,
      containerName,
      callback
    );
  };

  const removeContainer = async (containerId, containerName, callback) => {
    return await executeContainerCommand(
      "",
      "DELETE",
      containerId,
      containerName,
      callback
    );
  };

  const restartContainer = async (containerId, containerName, callback) => {
    return await executeContainerCommand(
      "restart",
      "POST",
      containerId,
      containerName,
      callback
    );
  };

  return {
    listContainers,
    startContainer,
    stopContainer,
    removeContainer,
    restartContainer,
  };
};
