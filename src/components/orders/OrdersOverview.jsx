import React, { useState, useEffect } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { ordersAPI } from '../../api/orders';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function OrdersOverview() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrderAnalytics(7);
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="right-column">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="right-column">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            {error}
            <button onClick={fetchAnalytics} style={{ display: 'block', margin: '10px auto' }}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Process time-based data
  const timeRanges = {
    Morning: '6–12 AM',
    Afternoon: '12–6 PM',
    Evening: '6–12 PM',
    Night: '12–6 AM'
  };

  const timeData = analyticsData?.ordersByTime || [];
  const timeLabels = timeData.map(item => item._id);
  const timeValues = timeData.map(item => item.count);
  const timeColors = ['#7C5CFC', '#A89CFF', '#C5C1FF', '#E5E1FF'];

  const donutData = {
    labels: timeLabels,
    datasets: [
      {
        data: timeValues,
        backgroundColor: timeColors.slice(0, timeLabels.length),
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    cutout: '75%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const time = timeRanges[label] || '';
            return `${label} (${time}): ${value} orders`;
          },
          title: function () {
            return '';
          },
        },
        displayColors: false,
      },
      legend: { display: false },
    },
  };

  // Process daily orders data
  const dailyData = analyticsData?.dailyOrders || [];
  const dailyLabels = dailyData.map(item => {
    const date = new Date(item._id);
    return date.getDate().toString().padStart(2, '0');
  });
  const dailyValues = dailyData.map(item => item.count);

  // Create previous week comparison data (mock for now)
  const previousWeekData = dailyValues.map(val => val * 0.9); // 10% less for demo

  const lineData = {
    labels: dailyLabels.length > 0 ? dailyLabels : ['01', '02', '03', '04', '05', '06'],
    datasets: [
      {
        label: 'This Week',
        data: dailyValues.length > 0 ? dailyValues : [0, 0, 0, 0, 0, 0],
        borderColor: '#7C5CFC',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#7C5CFC',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Last Week',
        data: previousWeekData.length > 0 ? previousWeekData : [0, 0, 0, 0, 0, 0],
        borderColor: '#ddd',
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const totalOrders = analyticsData?.totalOrders || 0;
  const percentageChange = analyticsData?.percentageChange || 0;
  const isPositive = percentageChange >= 0;

  return (
    <div className="right-column">
      {/* Order Time */}
      <div className="card">
        <div className="card-head">
          <div>
            <h4 className="card-title">Order Time</h4>
            <p className="card-sub">Last 7 days</p>
          </div>
          <button className="btn btn-outline view-report-btn" onClick={fetchAnalytics}>
            Refresh
          </button>
        </div>
        <div className="donut-wrap">
          <div className="donut big-donut">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
          <ul className="legend">
            {timeData.map((item, index) => (
              <li key={item._id}>
                <span 
                  className="dot" 
                  style={{ backgroundColor: timeColors[index] }}
                ></span>
                {item._id}
                <b>{item.count}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Orders */}
      <div className="card">
        <div className="card-head">
          <div>
            <h4 className="card-title">Orders</h4>
            <p className="card-sub">Last 7 days comparison</p>
          </div>
          <button className="btn btn-outline view-report-btn" onClick={fetchAnalytics}>
            Refresh
          </button>
        </div>
        <div className="orders-figures">
          <p className="orders-count">{totalOrders.toLocaleString()}</p>
          <span className={`orders-delta ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '+' : ''}{percentageChange}% vs last week
          </span>
        </div>
        <div className="line-chart">
          <Line
            data={lineData}
            options={{
              plugins: {
                legend: { 
                  display: true, 
                  position: 'bottom', 
                  labels: { usePointStyle: true, boxWidth: 6 } 
                }
              },
              scales: { 
                y: { display: false }, 
                x: { display: false } 
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}