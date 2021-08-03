import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function InvestedChart({labels, data}) {

  return (
    <div>
      <Doughnut
        data={{
          labels: labels,
          datasets: [{
            label: 'Investments',
            data: data,
            hoverOffset: 4
          }]
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Investments",
              font: {
                size: 25
              }
            },
            legend: {
              display: true,
              position: 'bottom',
            }
          }
        }}
      />
    </div>
  );
}