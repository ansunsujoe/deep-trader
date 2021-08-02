import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function Timeseries() {
  const timeLabels = ["9:00", "9:30", "10:00", "10:30"];
  const moneyData = ["24044", "25939", "26059", "25940"];

  return (
    <div>
      <Line
        data={{
          labels: [
            '',
            '',
            ''
          ],
          datasets: [{
            label: 'Timeseries',
            data: [300, 50, 100],
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