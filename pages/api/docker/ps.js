import { execute } from "utils/server/process";

const ps = async (_, res) => {
  try {
    const result = await execute("docker ps");
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default ps;
