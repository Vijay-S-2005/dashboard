import React, { useState, useEffect } from 'react';
import {  Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({  dataLive = [] }) => {
    // console.log("dataLive", dataLive);
    
  const sumOfData = () => {
    return dataLive.reduce((totals, item) => {
      totals.auto += item.auto || 0;
      totals.bus += item.bus || 0;
      totals.car += item.car || 0;
      totals.lcv += item.lcv || 0;
      totals.motorbike += item.motorbike || 0;
      totals.truck += item.truck || 0;
      return totals;
    }, { auto: 0, bus: 0, car: 0, lcv: 0, motorbike: 0, truck: 0 });
  }

  const [total, setTotal] = useState({});

  useEffect(() => {
    setTotal(sumOfData());
  }, [dataLive]);


  const dataPie = {
    labels: ['motorbike', 'car', 'bus', 'LCV', 'truck', 'auto'],
    datasets: [
      {
        label: 'Total vechiles',
        data: [total.motorbike, total.car, total.bus, total.lcv, total.truck, total.auto],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF99FF'],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };
//   console.log("total data to pie chat", total);

  const optionsPie = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };



  const chartStyle = {
    height: '250px',
        
  };

return (
    
    <>
        {dataLive.length > 0 ? 
                <>
                <h2 id="lineChartHistoryTitle" class="text-center">PIE CHART</h2>
                <div style={chartStyle}><Pie data={dataPie} options={optionsPie} /></div> 
                </>
                : null
        }
    </>
    
    // <div style={chartStyle}><Pie data={data} options={options} /></div>  
);
};

export default ChartComponent;
