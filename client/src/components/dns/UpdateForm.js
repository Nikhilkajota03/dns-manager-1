import React, { useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { message } from "antd";
const URL = "http://localhost:8080/api/v1";

function UpdateForm({ updateDNSRecords, setOpenForm, openForm }) {
  console.log(updateDNSRecords.ResourceRecords[0].Value);

  const [DNSName, setDNSName] = useState(updateDNSRecords.Name);
  const [Type, setType] = useState(updateDNSRecords.Type);
  const [TTL, setTTL] = useState(updateDNSRecords.TTL);
  const [Value, setValue] = useState(updateDNSRecords.ResourceRecords[0].Value);

  const HostedZoneId = "Z05457762EU2V64E5HHCE";



  const updaterecord = async (e) => {
    e.preventDefault();

    const records = [
      {
        Name: updateDNSRecords.Name, // Make sure this is defined or fetched correctly
        Type: Type, // Ensure this is defined
        TTL: TTL, // Ensure this is defined
        ResourceRecords: [{ Value: Value }], // Ensure 'Value' is defined and properly wrapped as an array of objects
      },
    ];

    try {
      const response = await axios.post(
        `${URL}/dns-records/update`,
        { records, HostedZoneId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Success:", response.data.message);
        message.success("DNS records updated successfully");
        setOpenForm(false)
      }
    } catch (error) {
      message.error("Error updated DNS records:", error);
      //   alert("Failed to delete DNS records");
    }
  };






  const closeForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="absolute top-[20%] left-[35vw] mx-auto w-[30%] z-[1000]">
      <form className="w-full max-w-sm mx-auto z-[100] bg-white p-8 rounded-md shadow-md">
        <button className="p-5" onClick={closeForm}>
          <CloseCircleOutlined />
          Cancel
        </button>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            DNS Name
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type="text"
            id="DNS Name"
            name="DNS Name"
            value={DNSName}
            onChange={(e) => setDNSName(e.target.value)}
            placeholder="DNS Name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="Type"
          >
            Type
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type="Type"
            id="Typeemail"
            name="Type"
            value={Type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            TTL
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type="tel"
            id="TTL"
            name="TTL"
            value={TTL}
            onChange={(e) => setTTL(e.target.value)}
            placeholder="TTL"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Value
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type="tel"
            id="Value"
            name="Value"
            value={Value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            required
          />
        </div>

        <button
          className="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          onClick={updaterecord}
        >
          Update DNS
        </button>
      </form>
    </div>
  );
}

export default UpdateForm;
