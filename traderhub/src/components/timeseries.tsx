import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function Timeseries(props) {

  return (
    <div>
      <Line
        data={{
          labels: [
            props.data.map((x: any) => '')
          ],
          datasets: [{
            label: 'Timeseries',
            data: props.data,
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