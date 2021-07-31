import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function NetWorthChart() {
  const timeLabels = ["9:00", "9:30", "10:00", "10:30"];
  const moneyData = ["24044", "25939", "26059", "25940"];

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
            data: [300, 50],
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