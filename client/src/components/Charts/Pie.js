import React, { useState,useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import axios from "axios";

function Pie() {
  const chartRef = useRef(null);
  const [domains, setDomains] = useState([]);


  //ResourceRecordSetCount

  
  useEffect(() => {

    const token = localStorage.getItem("jwt");


    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/v1/domain/all`,{

        headers: {
          Authorization: `Bearer ${token}`,
        }


        }
        );

        // setDomains(data);

        setDomains(data.map(domain => ({
          name: domain.Name,
          records: domain.ResourceRecordSetCount 
        })));




        // console.log(data[0].ResourceRecordSetCount);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  




  useEffect(() => {
    if (domains.length > 0) {
      const myChart = new Chart(chartRef.current, {
        type: 'pie',
        data: {
          labels: domains.map(domain => domain.name),
          datasets: [{
            label: 'Number of Records per Hosted Zone',
            data: domains.map(domain => domain.records),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)', // Add more colors as needed
              'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)', // Match border colors to the background colors
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });

      // Cleanup function to destroy chart when component unmounts
      return () => myChart.destroy();
    }
  }, [domains]); // Depend on domains so the chart is recreated when they change

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default Pie;