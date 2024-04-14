import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
import { useParams } from "react-router-dom";
import Navbar from "../../page/Navbar";
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:8080/api/v1";

function MultipleDns() {

  const navigate = useNavigate();

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



  // const HostedZoneId = "Z05457762EU2V64E5HHCE";

  const hostedZoneId = useParams().hostid;
  const hostedName = useParams().name;



  const CreateDns = async (e) => {

    e.preventDefault();
    //  console.log(domainName)

    try {
      const newDomainName = JSON.parse(dnsName);

      const response = await axios.post(
        `${URL}/dns-records/create-multi?HostedZoneId=${hostedZoneId}`,
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
        navigate(`/dns/${hostedName}/${hostedZoneId}`);
      } else {
        message.error("Failed to create domain please check the format");
        console.log(newDomainName, "DOMAIN NAME");
      }
    } catch (error) {
      message.error("internal servor error please check the format");
    }
  };

  return (

    <>

       <Navbar hostedZoneId={hostedZoneId} hostedName={hostedName} />


    <div class="h-[35rem] w-400 p-3 mx-auto m-2 border-2">

      <div class="p-1 flex justify-center">
        <h1 class="text-2xl font-bold">Create new dns</h1>
      </div>

      <div class="p-1 flex justify-center">
        <h1 class="text-xl font-bold">Enter your DNS values For Domain {hostedName} </h1>
      </div>

      {/* <div className="bg-black">
        <div class="mb-10 ">
          <label
            for="large-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          ></label>

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
      </div> */}

      <div class="w-full p-4 mt-5 text-center bg-cool-gray border border-red-500 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form>
          {/* <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="DNS Value"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DNS Value
              </label>
              <input
                type="text"
                
                id="DNS Value"
               
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="nikhil.com"
                required
              />
            </div>
            <div>
              <label
                for="DNS Type"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DNS Type
              </label>
              <input
                type="text"
                id="DNS Type"
               
              
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="AAAA"
                required
              />
            </div>
            <div>
              <label
                for="DNS TTL"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DNS TTL
              </label>
              <input
                type="text"
                id="DNS TTL"
               
               
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="3600"
                required
              />
            </div>
          </div> */}

          <div class="mb-6">
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
            />
          </div>



          <div class="auth flex items-center justify-center w-full md:w-full">
            <input
              type="file"
              ref={csvInputRef}
              onChange={handleCsvFileChange}
              style={{ display: "none" }}
              accept=".csv"
            />
            <button
              className="bg-blue-600 text-gray-200 px-6 py-3 text-lg rounded-lg hover:bg-blue-500 hover:text-gray-100"
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
              className="bg-blue-600 m-3 text-gray-200 px-6 py-3 text-lg rounded-lg hover:bg-blue-500 hover:text-gray-100"
              onClick={() => jsonInputRef.current.click()}
            >
              Select JSON file
            </button>

            </div>


            <button
              class="bg-green-600 text-gray-200 px-6 py-3 text-lg rounded-lg hover:bg-blue-500 hover:text-gray-100"
              onClick={CreateDns}
            >
              ADD DNS
            </button>




         
        </form>

        <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"></div>
      </div>
    </div>

    </>
  );
}

export default MultipleDns;
