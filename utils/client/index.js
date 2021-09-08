export const getElapsedTime = (unixTimestamp) => {
  const ts = unixTimestamp * 1000;

  let timediff = new Date() - ts; // ms
  timediff /= 1000; // seconds

  const seconds = Math.floor(timediff);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} minutes ago`;
  }
  return `${Math.floor(seconds / 60 / 60)} hours ago`;
};

export const copyToClipboard = async (text) => {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  await navigator.clipboard.write(data);
};
