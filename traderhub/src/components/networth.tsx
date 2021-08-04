import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function NetWorthChart({invested, cash}) {

  return (
    <div>
      <Doughnut
        data={{
          labels: [
            'Cash',
            'Invested',
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [cash, invested],
            backgroundColor: [
              'rgb(0, 185, 0)',
              '#ebd834',
            ],
            hoverOffset: 4
          }]
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Utility",
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