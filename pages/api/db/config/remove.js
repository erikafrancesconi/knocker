import { connect } from "db";

const remove = async (req, res) => {
  console.log(req.body.id);

  const client = await connect().catch((err) => {
    console.log("Unable to connect", err.stack);
    return res.status(500).json({ result: "Unable to connect." });
  });

  try {
    const text = "DELETE FROM configurations WHERE id = $1";
    const resp = await client.query(text, [req.body.id]);
    console.log(resp);

    return res.status(200).json({ result: "OK" });
  } catch (err) {
    console.error("Error in transaction", err.stack);
    return res.json({ result: "Unable to delete record." });
  } finally {
    client.release();
  }
};

export default remove;
