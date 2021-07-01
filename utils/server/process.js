import { exec } from "child_process";

// From https://stackoverflow.com/questions/12941083/execute-and-get-the-output-of-a-shell-command-in-node-js
export const execute = (command) => {
  return new Promise(function (resolve, reject) {
    exec(command, function (error, standardOutput, standardError) {
      if (error) {
        return reject();
      }

      if (standardError) {
        return reject(standardError);
      }

      resolve(standardOutput);
    });
  });
};
