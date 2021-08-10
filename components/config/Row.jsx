import { useState } from "react";

import router from "next/router";

const Row = ({ data, run }) => {
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
    run(name, filepath, compose);
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
    <tr>
      <td className="px-6 py-2 text-sm text-gray-900 align-top font-medium">
        {name}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 align-top">
        <div className="text-sm">{filepath}</div>
        <div className="text-xs text-gray-500 mt-1">
          {services.map((service, idx) => (
            <span key={idx} className="mr-4 pb-1">
              <input
                type="checkbox"
                name={service}
                id={`${id}-${service}`}
                className="focus:ring-indigo-500 h-4 w-4 mr-1 mb-1 text-indigo-600 border-gray-300 rounded"
                onChange={updateServiceState}
                checked={servicesObj[service] || false}
              />
              <label htmlFor={`${id}-${service}`}>{service}</label>
            </span>
          ))}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          className="bg-green-700 hover:bg-green-500 rounded-md inline-flex items-center py-1 px-2 mr-1 text-white"
          title="Run Configuration"
          onClick={runConfiguration}
        >
          Run
        </button>
        <button
          className="bg-red-700 hover:bg-red-500 rounded-md inline-flex items-center py-1 px-2 mr-1 text-white"
          title="Delete Configuration"
          onClick={deleteConfiguration}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Row;
