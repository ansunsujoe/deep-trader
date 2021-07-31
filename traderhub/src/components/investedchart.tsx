import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function InvestedChart() {
  const timeLabels = ["9:00", "9:30", "10:00", "10:30"];
  const moneyData = ["24044", "25939", "26059", "25940"];

  return (
    <div>
      <Doughnut
        data={{
          labels: [
            'Red',
            'Blue',
            'Yellow'
          ],
          datasets: [{
            label: 'Investments',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
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