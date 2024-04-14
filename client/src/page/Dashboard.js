import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar.js";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
import SingleDomain from "../components/Domain/SingleDomain.js";
import MultipleDomain from "../components/Domain/MultipleDomain.js";
import { useNavigate } from "react-router-dom";
import DomainNavbar from "../page/DomainNavbar.js";

const URL = "http://localhost:8080";

const Dashboard = () => {
  const navigate = useNavigate();

  const [showSingleeDom, setShowSingleDom] = useState(false);
  const [domains, setDomains] = useState([]);

  const handleDelete = async (name) => {

    const token = localStorage.getItem("jwt");

    try {
      console.log(JSON.stringify([{ Name: name }]));

      const response = await axios.post(
        `${URL}/api/v1/domain/delete`,
        [{ Name: name }],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 204) {
        message.success(`${name} deleted successfully`);
        fetchData();
      } else {
        message.error("Failed to delete domain");
      }
    } catch (error) {
      message.error("Error occurred: " + error.message);
    }
  };

  const fetchData = async () => {

    const token = localStorage.getItem("jwt");

    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/domain/all`,{

        headers: {
          Authorization: `Bearer ${token}`,
        }


        }
      );

      setDomains(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [authenticated, setAuthenticated] = useState(true);

  const verify = async () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      axios
        .post("http://localhost:8080/api/v1/users/verify", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.authenticated) {
            setAuthenticated(true);
            console.log(response);
          } else {
            setAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error("Error verifying authentication status:", error);
          setAuthenticated(false);
        });
    } else {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <DomainNavbar />

      <div className="text-gray-900  border-red-500 h-400">
        <div className="p-11 flex justify-center">
          <h1 className="text-3xl font-bold">Hosted Zone</h1>
        </div>

        <div class="p-5 h-screen border-red-500">
          <div class="overflow-auto border-2   rounded-lg shadow hidden md:block">
            <table class="w-full border-2 border-gray-300">
              <thead class="bg-gray-300  ">
                <tr>
                  <th class="w-20  border-2 p-3 text-2xl font-semibold tracking-wide text-center">
                    Domain Name
                  </th>
                  <th class="w-24 p-3  border-2 text-2xl font-semibold tracking-wide text-center">
                    Records
                  </th>
                  <th class="w-24 p-3   border-2 text-2xl font-semibold tracking-wide text-center">
                    Host ID
                  </th>
                  <th class="w-24 p-3  border-2 text-2xl font-semibold tracking-wide text-center">
                    Add DNS
                  </th>
                  <th class="w-32 p-3   border-2 text-2xl font-semibold tracking-wide text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              {domains.map((value, index) => (
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
                      {value.ResourceRecordSetCount}
                    </td>
                    <td class="p-3 text-xl text-gray-700 whitespace-nowrap">
                      <span class="p-1.5 text-xl font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                        {value.Id.split("/").pop()}
                      </span>
                    </td>
                    <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        class="bg-green-600 text-gray-200 font-bold tracking-widest py-2 px-5 rounded  hover:bg-blue-500 hover:text-gray-100"
                        onClick={() =>
                          navigate(
                            `/dns/${value.Name}/${value.Id.split("/").pop()}`
                          )
                        }
                      >
                        ADD DNS
                      </button>
                    </td>
                    <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        className="mr-4 "
                        title="Delete"
                        onClick={() => handleDelete(value.Name)}
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
};

export default Dashboard;
