import { connect } from "db";

const add = async (req, res) => {
  console.log(req.body);

  const client = await connect().catch((err) => {
    console.log("Unable to connect", err.stack);
    return res.status(500).json({ result: "Unable to connect." });
  });

  try {
    const text =
      "INSERT INTO configurations (name, filepath, compose) VALUES($1, $2, $3) RETURNING id";
    const resp = await client.query(text, [
      req.body.name,
      req.body.file,
      +req.body.fileType,
    ]);
    console.log(resp);

    return res.status(200).json({ result: "OK" });
  } catch (err) {
    console.error("Error in transaction", err.stack);
    return res.json({ result: "Unable to save record." });
  } finally {
    client.release();
  }
};

export default add;
