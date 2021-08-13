import { execute } from "utils/server/process";

const containerprune = async (req, res) => {
  console.log("Pruning");
  try {
    const result = await execute("docker container prune -f");
    return res.status(200).json({ result: "OK" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default containerprune;
