import React, { useEffect, useState } from "react";

import Layout from "components/Layout";
import Table from "components/Table";

const Home = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/docker/ps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { result } = await res.json();
      let rows = result
        .split("\n")
        .map((row) => row.split("  ").filter((r) => r !== ""))
        .filter((row) => row.length > 0);

      rows[0].splice(2, 1); // Command is useless
      setHeaders(rows[0]);

      rows = rows.filter((row, idx) => idx > 0);
      rows.forEach((d) => {
        if (!d[4].trim().startsWith("Up") || d.length < 7) {
          // Inserting white element for ports if process is not up
          d.splice(5, 0, "");
        }
        d[5] = d[5].split(",").join("<br />");
        d.splice(2, 1); // Command is useless
      });
      setData(rows);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Table
        title="Running processes"
        columns={headers}
        rows={data}
        refreshData={fetchData}
      />
    </Layout>
  );
};

export default Home;
