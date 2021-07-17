import { execute } from "utils/server/process";

const rm = async (req, res) => {
  const { containerId } = req.body;

  try {
    const result = await execute(`docker rm ${containerId}`);
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default rm;
