import { dirname } from "path";
import { exec } from "child_process";

const up = async (req, res) => {
  const { filepath, servizi } = req.body;
  console.log(servizi);

  const folder = dirname(filepath);

  return new Promise((resolve) => {
    const process = exec(
      `docker-compose up -d ${servizi.join(" ")}`,
      {
        cwd: folder,
      },
      (error) => {
        if (error) {
          res.status(500).end(error.message);
          return resolve();
        }
        res.end("Done.");
        return resolve();
      }
    );

    // Questi tre sono gestiti dalla callback
    // process.on("close", (code) => {
    //   console.log(`child process close all stdio with code ${code}`);
    // });
    // process.on("error", (err) => {
    //   console.error(`child process crashed with error ${err}`);
    // });
    // process.on("exit", (code, signal) => {
    //   console.error(`child process exited with code ${code}: ${signal}`);
    // });

    // Never fired?
    // process.on("message", (message) => {
    //   console.log("message", message);
    // });

    process.stdout.on("data", (data) => {
      res.write(data);
    });
    process.stderr.on("data", (data) => {
      res.write(data);
    });
  });
};

export default up;
