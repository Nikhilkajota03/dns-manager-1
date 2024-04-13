
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import csvtojson from "csvtojson";
const URL = "http://localhost:8080";

function SingleDomain() {


    const [singledomainName, setSingleDomainName] = useState("");


    const CreateSingleDomain = async (e) => {
        console.log(singledomainName);
    
        try {
          // const newDomainName = JSON.parse(singledomainName);
    
          const response = await axios.post(
            `${URL}/api/v1/domain/create`,
            [{ Name: singledomainName }],
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          console.log(response.status);
    
          if (response.status === 200 || response.status === 201) {
            message.success(` Domains Created successfully`);
            setSingleDomainName("");
          }
        } catch (error) {
          console.error('Error during domain creation:', error);
          message.error("Internal server error");
        }
      };






  return (

    <div class="h-[18rem] w-400  mx-auto m-2 border-2 border-black">
          <div class="p-1 flex justify-center">
            <h1 class="text-2xl font-bold">Create new hosted zone</h1>
          </div>

          <div class="p-1 flex justify-center">
            <h1 class="text-xl font-bold">Enter your domains below</h1>
          </div>

          <div class="mb-10 ">
            <label
              for="large-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            ></label>

            <textarea
              id="domainName"
              className="w-[20vw] h-[27px] "
              value={singledomainName}
              onChange={(event) => setSingleDomainName(event.target.value)}
            ></textarea>
          </div>

          <div
            class="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
            id="nav-content"
          >
            <button
              class="bg-blue-600 text-gray-200   p-2 rounded mr-3  hover:bg-blue-500 hover:text-gray-100"
              onClick={CreateSingleDomain}
            >
              Add single domain
            </button>
          </div>
        </div>
  )
}

export default SingleDomain