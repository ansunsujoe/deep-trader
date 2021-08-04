import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {colors} from '../modules/colors.js';

export default function InvestedChart({labels, data}) {

  return (
    <div>
      <Doughnut
        data={{
          labels: labels,
          datasets: [{
            label: 'Investments',
            data: data,
            backgroundColor: colors.slice(0, labels.length),
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