import { exec } from "child_process";

const logs = async (req, res) => {
  const { containerId } = req.body;

  return new Promise((resolve) => {
    const process = exec(`docker logs ${containerId}`, (error) => {
      if (error) {
        res.status(500).end(error.message);
        return resolve();
      }
      res.end();
      return resolve();
    });

    process.stdout.on("data", (data) => {
      res.write(data);
    });
    process.stderr.on("data", (data) => {
      res.write(data);
    });
  });
};

export default logs;
