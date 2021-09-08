import { useEffect, useState } from "react";
import { Layout, GenericDataTable } from "components";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const Page = ({ title, tabs, fetchFunction = async () => {}, rowId }) => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    const result = await fetchFunction();
    console.log(result);
    setData(result);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={title}>
      <Tabs variant="enclosed-colored">
        <TabList>
          {tabs.map((tab, idx) => {
            return <Tab key={idx}>{tab.tabTitle}</Tab>;
          })}
        </TabList>
        <TabPanels pt={2}>
          {tabs.map((tab, idx) => {
            return (
              <TabPanel key={idx}>
                <GenericDataTable
                  rows={data[tab.resultPart]}
                  refreshData={fetchData}
                  rowId={rowId}
                  {...tab}
                />
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Page;
