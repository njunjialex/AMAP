import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BookingsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/status-chart/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data) && isMounted) {
          const labels = response.data.map((item) => item.status);
          const counts = response.data.map((item) => item.count);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Bookings by Status',
                data: counts,
                backgroundColor: [
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#FF6384',
                  '#9966FF',
                ],
                borderRadius: 6,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading chart...</p>;

  if (!chartData) return <p>No data available</p>;

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h4>Bookings by Status</h4>
      <Bar data={chartData} />
    </div>
  );
};

export default BookingsChart;
