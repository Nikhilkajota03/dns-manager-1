import React, { useState,useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import axios from "axios";


function LineChart() {

  const chartRef = useRef(null);
  const [domains, setDomains] = useState([]);

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
        type: 'line',
        data: {
          labels: domains.map(domain => domain.name), // Dynamically set the labels from domains
          datasets: [{
            label: 'Number of Records per Domain',
            data: domains.map(domain => domain.records), // Dynamically set the data from domains
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });

      // Cleanup function to destroy the chart when the component unmounts
      return () => myChart.destroy();
    }
  }, [domains]); // Make sure to add domains as a dependency

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default LineChart;