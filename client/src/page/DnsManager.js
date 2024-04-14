import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar.js";
import { message, Modal } from "antd";
import { useParams } from "react-router-dom";
import csvtojson from "csvtojson";
import MultipleDns from "../components/dns/MultipleDns.js";
import SingleDns from "../components/dns/SingleDns.js";
import UpdateForm from "../components/dns/UpdateForm.js";
const URL = "http://localhost:8080/api/v1";

function DnsManager() {
  const [showSingleeDom, setShowSingleDom] = useState(false);

  const [dnsRecords, setDnsRecords] = useState([]);

  const [openForm, setOpenForm] = useState(false);

  const [updateDNSRecords, setUpdateDNSRecords] = useState([]);

  const [selectedRecords, setSelectedRecords] = useState([]);

  const hostedZoneId = useParams().hostid;
  const hostedName = useParams().name;

  const deleteDNS = async (recordsss) => {
    const records = [recordsss];
    try {
      const response = await axios.post(
        `${URL}/dns-records/delete`,
        { records, hostedZoneId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Success:", response.data.message);
        message.success("DNS records deleted successfully");
        fetchData();
      }
    } catch (error) {
      message.error("Error deleting DNS records:", error);
    }
  };



  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${URL}/dns-records/all`, {
        params: {
          HostedZoneId: hostedZoneId,
        },
      });

      setDnsRecords(data.ResourceRecordSets);

      console.log(data.ResourceRecordSets);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  return (
    <>

     <Navbar hostedName={hostedName}  hostedZoneId={hostedZoneId} />


      <div className="text-gray-900 h-400 ">
        <div className="p-11 flex justify-center">
          <h1 className="text-3xl font-bold">Domain Management</h1>
        </div>

      

        <div
          class="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
          id="nav-content"
        >
 
        </div>

        {openForm && (
          <UpdateForm
            updateDNSRecords={updateDNSRecords}
            setOpenForm={setOpenForm}
            openForm={openForm}
          />
        )}




        <div class="p-5 h-screen bg-gray-100">
          <div class="overflow-auto border-2   rounded-lg shadow hidden md:block">
            <table class="w-full border-2 border-gray-300">
              <thead class="bg-gray-300">
                <tr>
                  <th class="w-20  border-2 p-3 text-2xl font-semibold tracking-wide text-center">
                    Domain Names
                  </th>
                  <th class="w-24 p-3  border-2 text-2xl font-semibold tracking-wide text-center">
                    Type
                  </th>
                  <th class="w-24 p-3   border-2 text-2xl font-semibold tracking-wide text-center">
                    TTL
                  </th>
                  <th class="w-24 p-3  border-2 text-2xl font-semibold tracking-wide text-center">
                    Value
                  </th>
                  <th class="w-32 p-3   border-2 text-2xl font-semibold tracking-wide text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              {dnsRecords.map((value, index) => (



                <tbody class="divide-y divide-gray-100">
                  <tr class="bg-gray-100">
                    <td class="p-3 text-xl text-gray-700 whitespace-nowrap">
                      <a
                        href="#"
                        class="font-bold text-blue-500 hover:underline"
                      >
                        {value.Name}
                      </a>
                    </td>
                    <td class="p-3 text-xl text-gray-700 whitespace-nowrap">
                      {value.Type}
                    </td>
                    <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span class="p-1.5 text-xl font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                        {value.TTL}
                      </span>
                    </td>
                    <td class="p-3 text-2xl text-gray-700 whitespace-nowrap">
                      {" "}
                      {value.ResourceRecords[0].Value.split(". ").map(
                        (record, index, array) =>
                          index < array.length - 1 ? (
                            <div key={index}>{record}.</div>
                          ) : (
                            <div key={index}>{record}</div>
                          )
                      )}
                    </td>
                    <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        className="mr-4"
                        title="Edit"
                        onClick={() => {
                          setOpenForm(true);
                          setUpdateDNSRecords(value);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 fill-blue-500 hover:fill-blue-700"
                          viewBox="0 0 348.882 348.882"
                        >
                          <path
                            d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                            data-original="#000000"
                          />
                          <path
                            d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                            data-original="#000000"
                          />
                        </svg>
                      </button>

                      <button
                        className="mr-4"
                        title="Delete"
                        onClick={() => deleteDNS(value)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 fill-red-500 hover:fill-red-700"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000"
                          />
                          <path
                            d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>




              ))}
            </table>
          </div>

         
        </div>


      </div>
    </>
  );
}

export default DnsManager;
