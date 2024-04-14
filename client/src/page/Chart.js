import React from "react";
import Pie from "../components/Charts/Pie";
import LineChart from "../components/Charts/LineChart";
import DomainNavbar from "./DomainNavbar";

function Chart() {
  return (
    <>

      <DomainNavbar/>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-center">Charts for the Hosted Domain</h1>

        <div class="  w-[98vw] h-[980px]    p-6 bg-cool-gray border border-red-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

        <div className="flex justify-around items-center">
          <div className="w-[40vw] h-[920px] p-3  bg-white  shadow border-red-200  rounded-lg">
            <Pie />
          </div>
          <div className="w-[40vw] h-[500px]  bg-white   p-3 shadow border-red-200  rounded-lg">
            <LineChart />
          </div>
        </div>


        </div>




        





      </div>
    </>
  );
}

export default Chart;
