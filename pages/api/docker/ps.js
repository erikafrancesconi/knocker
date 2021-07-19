import { execute } from "utils/server/process";

const ps = async (req, res) => {
  const { options } = req.body;

  try {
    const result = await execute(`docker ps ${options}`);
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default ps;
