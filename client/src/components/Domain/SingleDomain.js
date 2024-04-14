import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
import DomainNavbar from "../../page/DomainNavbar";
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:8080";

function SingleDomain() {

  const navigate = useNavigate();


  const [singledomainName, setSingleDomainName] = useState("");

  const CreateSingleDomain = async (e) => {
    console.log(singledomainName);

    const token = localStorage.getItem("jwt");

    e.preventDefault();

    try {
      // const newDomainName = JSON.parse(singledomainName);

      const response = await axios.post(
        `${URL}/api/v1/domain/create`,
        [{ Name: singledomainName }],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.status);

      if (response.status === 200 || response.status === 201) {
        message.success(` Domains Created successfully`);
        navigate("/")
        setSingleDomainName("");
      }
    } catch (error) {
      console.error("Error during domain creation:", error);
      message.error("Internal server error");
    }
  };

  return (

    <>


    <DomainNavbar/>


    <div class="h-[20rem] w-200 overflow-hidden mx-auto m-8 border-2 flex flex-col items-center justify-center">

      <div class="p-1 flex justify-center">
        <h1 class="text-2xl font-bold">Create new hosted zone</h1>
      </div>

      <div class="p-1 flex justify-center">
        <h1 class="text-xl font-bold">Enter your domains below</h1>
      </div>

      <div class="w-[25vw]    justify-center   p-5 mt-5 text-center  bg-cool-gray border border-red-500 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="max-w-sm mx-auto">
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Domain Name
            </label>
            <input
              onChange={(e) => setSingleDomainName(e.target.value)}
              type="domain"
              id="domain"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="nikhil.com"
              required
            />
          </div>

          <button
            type="submit"
            class="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={CreateSingleDomain}
          >
            Submit
          </button>
        </form>

        <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"></div>
      </div>



    </div>

    </>


  );
}

export default SingleDomain;
