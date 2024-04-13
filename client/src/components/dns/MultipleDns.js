import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
const URL = "http://localhost:8080/api/v1";



function MultipleDns() {

  const csvInputRef = useRef(null);
  const jsonInputRef = useRef(null);
  const [dnsName, setDnsName] = useState("");
  const [singledomainName, setSingleDomainName] = useState("");

  const csvToJson = async (csvData) => {
    try {
      const jsonData = await csvtojson().fromString(csvData);
      return jsonData;
    } catch (error) {
      console.error("Error converting CSV to JSON:", error);
      throw error;
    }
  };

  const handleCsvFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;
      // Convert CSV data to JSON
      const jsonData = await csvToJson(fileContent);
      // Convert JSON array to string
      const jsonString = JSON.stringify(jsonData, null, 2);
      setDnsName(jsonString);
    };

    reader.readAsText(file);
  };

  const handleJsonFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setDnsName(fileContent);
    };

    reader.readAsText(file);
  };

  const HostedZoneId = "Z05457762EU2V64E5HHCE"




  const CreateDns = async (e) => {


    //  console.log(domainName)

    try {
      const newDomainName = JSON.parse(dnsName);

      const response = await axios.post(
        `${URL}/dns-records/create-multi?HostedZoneId=${HostedZoneId}`,
        newDomainName,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        message.success(`All Domains Created successfully`);
        setDnsName("");
      } else {
        message.error("Failed to create domain please check the format");
        console.log(newDomainName, "DOMAIN NAME");
      }
    } catch (error) {
      message.error("internal servor error please check the format");
    }





  };








  return (


      <div class="h-[35rem] w-400  mx-auto m-2 border-2 border-black">
    <div class="p-1 flex justify-center">
      <h1 class="text-2xl font-bold">Create new dns</h1>
    </div>

    <div class="p-1 flex justify-center">
      <h1 class="text-xl font-bold">Enter your multiple dns below</h1>
    </div>

    <div class="mb-10 ">
      <label
        for="large-input"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        
      </label>

      <textarea
        id="domainName"
        className="w-[80vw] "
        value={dnsName}
        onChange={(event) => setDnsName(event.target.value)}
        placeholder={`
            // please  Enter your Valid domains here in following format
                          [
                                 {
                                    "Name" :"example.app"
                                  },
                                  {
                                   "Name" :"usman.example.app"
                                 },
                                 {
                                   "Name" :"ansari.example.in"
                                 }
                          ]`}
        rows={15}
        required
      ></textarea>
    </div>

    <div
      class="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
      id="nav-content"
    >
      <div class="auth flex items-center w-full md:w-full">
        <input
          type="file"
           ref={csvInputRef}
          onChange={handleCsvFileChange}
          
          style={{ display: "none" }}
          accept=".csv"
        />
        <button
          className="bg-blue-600 text-gray-200 p-2 rounded mr-3 hover:bg-blue-500 hover:text-gray-100"
          onClick={() => csvInputRef.current.click()}
        >
          Select CSV file
        </button>

        <input
          type="file"
          ref={jsonInputRef}
          onChange={handleJsonFileChange}
          style={{ display: "none" }}
          accept=".json"
        />
        <button
          className="bg-blue-600 text-gray-200 p-2 mr-3  rounded hover:bg-blue-500 hover:text-gray-100"
          onClick={() => jsonInputRef.current.click()}
        >
          Select JSON file
        </button>

        <button
          class="bg-blue-600 text-gray-200  p-2 rounded mr-3  hover:bg-blue-500 hover:text-gray-100"
            onClick={CreateDns}
        >
          Add dns
        </button>
      </div>
    </div>
  </div>





  )
}

export default MultipleDns