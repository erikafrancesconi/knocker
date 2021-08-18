import { useState } from "react";

import router from "next/router";

import { Tr, Td, VStack, Box, Text, Checkbox, Button } from "@chakra-ui/react";

const ConfigRow = ({ data, run }) => {
  const { id, name, filepath, compose, services } = data;

  const [servicesObj, setServicesObj] = useState({});

  const updateServiceState = (e) => {
    const fieldName = e.target.name;
    setServicesObj({
      ...servicesObj,
      [fieldName]: e.target.checked,
    });
  };

  const runConfiguration = () => {
    let servizi = [];
    for (const [k, v] of Object.entries(servicesObj)) {
      if (v) {
        servizi.push(k);
      }
    }
    if (servizi.length === services.length) {
      // Se sono selezionati tutti non ho bisogno di lanciarli singolarmente
      servizi = [];
    }
    run(name, filepath, compose, servizi);
  };

  const deleteConfiguration = async () => {
    const res = await fetch("/api/db/config/remove", {
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      router.push("/config");
    }
  };

  return (
    <Tr>
      <Td valign="top">{name}</Td>
      <Td>
        <VStack align="start">
          <Text>{filepath}</Text>
          <Box>
            {services.map((service, idx) => (
              <Box key={idx}>
                <Checkbox
                  name={service}
                  id={`${id}-${service}`}
                  onChange={updateServiceState}
                  isChecked={servicesObj[service] || false}
                >
                  {service}
                </Checkbox>
              </Box>
            ))}
          </Box>
        </VStack>
      </Td>
      <Td valign="top" textAlign="right">
        <Button
          colorScheme="green"
          title="Run Configuration"
          onClick={runConfiguration}
        >
          Run
        </Button>
      </Td>
    </Tr>
  );
};

export default ConfigRow;
