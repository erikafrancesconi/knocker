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

export const readableDate = (date) => {
  const dateParts = new Date(date).toISOString().split("T");
  return `${dateParts[0]} ${dateParts[1].substring(
    0,
    dateParts[1].indexOf(".")
  )}`;
};

export const copyToClipboard = async (text) => {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  await navigator.clipboard.write(data);
};
