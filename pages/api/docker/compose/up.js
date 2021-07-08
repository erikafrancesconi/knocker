import { dirname } from "path";
import { spawn } from "child_process";

export default async (req, res) => {
  const { filepath } = req.body;
  const folder = dirname(filepath);

  try {
    spawn("docker-compose", ["up"], {
      cwd: folder,
      detached: true,
    });

    return res.status(200).json({ result: "OK" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
