import { execute } from "utils/server/process";

const stop = async (req, res) => {
  const { containerId, containerName } = req.body;

  if (containerName.trim().startsWith("knocker")) {
    return res.status(418).json({ error: "Sorry, I can't do that." });
  }

  try {
    const result = await execute(`docker stop ${containerId}`);
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default stop;
