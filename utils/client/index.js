export const colorMessage = (message) => {
  if (message.startsWith("ERROR")) {
    return <span className="text-red-800">{message}</span>;
  }
  return message;
};
