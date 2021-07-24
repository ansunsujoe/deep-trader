import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function NetWorthChart() {
  const timeLabels = ["9:00", "9:30", "10:00", "10:30"];
  const moneyData = ["24044", "25939", "26059", "25940"];

  return (
    <div>
      <Line
        data={{
          labels: timeLabels,
          datasets: [
            {
              label: 'Capital',
              fill: false,
              lineTension: .5,
              backgroundColor: 'skyblue',
              borderColor: 'skyblue',
              borderWidth: 2,
              data: moneyData
            },
          ]
        }}
        options={{
          title: {
            display: true,
            text: 'Total Capital',
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );
}