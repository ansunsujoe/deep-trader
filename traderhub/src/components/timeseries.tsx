import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function Timeseries({data}) {

  return (
    <div>
      <Line
        data={{
          labels: Array(data.length).fill(''),
          datasets: [{
            label: 'Timeseries',
            data: data,
            borderColor: '#11c26f',
            hoverOffset: 4
          }]
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Price Over Time",
              font: {
                size: 25
              }
            },
            legend: {
              display: false,
              position: 'bottom',
            }
          }
        }}
      />
    </div>
  );
}