import { useToast } from "@chakra-ui/react";

export const useDocker = () => {
  const toast = useToast();

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
        body: JSON.stringify({ containerId, containerName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) {
        toast({
          title: res.statusText,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return "KO";
      }

      const { result } = await res.json();

      if (result.replaceAll("\n", "") === containerId) {
        toast({
          title: `Container ${containerName} ${command.resok}.`,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        callback();
        return "OK";
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
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
