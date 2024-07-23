import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const ScrollableLineChart = ({ type, data = [] ,liveData}) => {
  console.log("data", data);  
  const [start, setStart] = useState(Math.max(data.length - 10, 0));
  const pointsToShow = 10;

  useEffect(() => {
    setStart(Math.max(data.length - pointsToShow, 0));
  }, [data]);

  const handleScroll = (event) => {
    const delta = Math.sign(event.deltaX);
    const newStart = Math.max(0, Math.min(data.length - pointsToShow, start + delta));
    setStart(newStart);
  };

  const slicedData = data.slice(start, start + pointsToShow);

  const chartDataYesterday ={
    labels: slicedData.map((d) => new Date(d.todaytimestamp).toLocaleTimeString()),
    datasets:[
      {
        label:'Today',
        data:slicedData.map((d) => d.todaytotal),
        fill:false,
        backgroundColor:'rgba(75,192,192,0.4)',
        borderColor:'rgba(75,192,192,1)'
      },
      {
        label:'Yesterday',
        data:slicedData.map((d) => d.yestrdaytotal),
        fill:false,
        backgroundColor:'rgba(192,75,75,0.4)',
        borderColor:'rgba(192,75,75,1)'
      }
    ]
  };

  const chartDataLive = {
    labels: slicedData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Auto',
        data: slicedData.map((d) => d.auto),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Bus',
        data: slicedData.map((d) => d.bus),
        fill: false,
        backgroundColor: 'rgba(192,75,75,0.4)',
        borderColor: 'rgba(192,75,75,1)',
      },
      {
        label: 'Car',
        data: slicedData.map((d) => d.car),
        fill: false,
        backgroundColor: 'rgba(75,75,192,0.4)',
        borderColor: 'rgba(75,75,192,1)',
      },
      {
        label: 'LCV',
        data: slicedData.map((d) => d.lcv),
        fill: false,
        backgroundColor: 'rgba(192,192,75,0.4)',
        borderColor: 'rgba(192,192,75,1)',
      },
      {
        label: 'Motorbike',
        data: slicedData.map((d) => d.motorbike),
        fill: false,
        backgroundColor: 'rgba(75,192,75,0.4)',
        borderColor: 'rgba(75,192,75,1)',
      },
      {
        label: 'Truck',
        data: slicedData.map((d) => d.truck),
        fill: false,
        backgroundColor: 'rgba(192,75,192,0.4)',
        borderColor: 'rgba(192,75,192,1)',
      },
    ],
  };

  return (
    <>
      {data.length > 0 && (
        <div onWheel={handleScroll} style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', height: '300px' }}>
          <Line
            data={liveData?chartDataLive:chartDataYesterday}
            options={{
              animation: false,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'category',
                  title: {
                    display: true,
                    text: 'Time',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Count',
                  },
                },
              },
            }}
            height={500}
          />
        </div>
      )
      }
    </>
  );
};

export default ScrollableLineChart;
