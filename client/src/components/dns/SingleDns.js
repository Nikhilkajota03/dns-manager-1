import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
const URL = "http://localhost:8080/api/v1";

const SingleDns = () => {
  const [singledomainName, setSingleDomainName] = useState("");

  const [domainName, setDomainName] = useState("");
  const [Type, setType] = useState("");
  const [TTL, SetTTL] = useState("");
  const [ResourceRecords, setResourceRecords] = useState("");

  const HostedZoneId = "Z05457762EU2V64E5HHCE";

  const addDNS = async (e) => {
    e.preventDefault();
    try {
      const parsedResourceRecords = JSON.parse(ResourceRecords);
      const response = await axios.post(
        `${URL}/dns-records/create-multi?HostedZoneId=${HostedZoneId}`,
        [
          {
            Name: domainName,
            Type: Type,
            TTL: TTL,
            ResourceRecords: parsedResourceRecords,
          },
        ]
      );

      console.log("response after create", response);

      if (response.status === 201) {
        message.success(`${domainName} created successfully`);
        setDomainName(""); // Reset domainName when success
        setType(""); // Reset Type
        SetTTL(""); // Reset TTL
        setResourceRecords(""); // Reset ResourceRecords
      } else {
        message.error(response.error , "Failed to create domain");
        console.log(domainName, "DOMAIN NAME");
      }
    } catch (error) {
      message.error("Error occurred: " + "please fill the form correctly");
      console.log("Request error:", error);
    }
  };

  return (
    <div class="h-[35rem] w-400 p-3 mx-auto m-2 border-2 border-black">
      <div class="p-1 flex justify-center">
        <h1 class="text-2xl font-bold">Create new DNS</h1>
      </div>

      <div class="p-1 flex justify-center">
        <h1 class="text-xl font-bold">Enter your DNS values below</h1>
      </div>

      <div className="p-4">
        <form>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="DNS Value"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DNS Value
              </label>
              <input
                type="text"
                value={domainName}
                id="DNS Value"
                onChange={(event) => setDomainName(event.target.value)}
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
                value={Type}
                onChange={(event) => setType(event.target.value)}
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
                value={TTL}
                onChange={(event) => SetTTL(event.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="3600"
                required
              />
            </div>
          </div>

          <div class="mb-6">
            <label
              for="DNS ResourceRecords"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              DNS ResourceRecords
            </label>

            <textarea
            value={ResourceRecords}
              className="bg-gray-50 border border-gray-300 h-[10rem] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pb-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              id="ResourceRecords"
              placeholder={`

            [
              {
                  "Value": "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
              }
            ]

            `}
              onChange={(event) => setResourceRecords(event.target.value)}
              rows={8}
            />
          </div>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={addDNS}
          >
            ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleDns;
