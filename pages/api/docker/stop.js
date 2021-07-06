import { execute } from "utils/server/process";

export default async (req, res) => {
  const { containerId } = req.body;

  try {
    const result = await execute(`docker stop ${containerId}`);
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
