import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingCart, FiPackage, FiUserPlus, FiDownload } from 'react-icons/fi';
import { dashboardAPI } from '../../api/dashboard';

export default function SalesSummary() {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSalesSummary();
      setSalesData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error('Sales data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const getStats = () => {
    if (!salesData) {
      // Fallback static data while loading
      return [
        { icon: <FiDollarSign />, title: 'Total Sales', value: '--', change: 'Loading...', bg: '#fde7ef' },
        { icon: <FiShoppingCart />, title: 'Total Order', value: '--', change: 'Loading...', bg: '#fff1e6' },
        { icon: <FiPackage />, title: 'Product Sold', value: '--', change: 'Loading...', bg: '#e7f9f0' },
        { icon: <FiUserPlus />, title: 'New Customers', value: '--', change: 'Loading...', bg: '#f3f0ff' },
      ];
    }

    return [
      { 
        icon: <FiDollarSign />, 
        title: 'Total Sales', 
        value: formatCurrency(salesData.totalSales.value), 
        change: salesData.totalSales.change, 
        bg: '#fde7ef' 
      },
      { 
        icon: <FiShoppingCart />, 
        title: 'Total Order', 
        value: salesData.totalOrders.value.toString(), 
        change: salesData.totalOrders.change, 
        bg: '#fff1e6' 
      },
      { 
        icon: <FiPackage />, 
        title: 'Product Sold', 
        value: salesData.productsSold.value.toString(), 
        change: salesData.productsSold.change, 
        bg: '#e7f9f0' 
      },
      { 
        icon: <FiUserPlus />, 
        title: 'New Customers', 
        value: salesData.newCustomers.value.toString(), 
        change: salesData.newCustomers.change, 
        bg: '#f3f0ff' 
      },
    ];
  };

  const stats = getStats();

  if (error) {
    return (
      <div>
        <div className="card-head" style={{ marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1e1e2d' }}>Today's Sales</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Sales Summary</p>
          </div>
          <button className="btn btn-outline" onClick={fetchSalesData}>
            <FiDownload style={{ marginRight: '6px' }} />
            Retry
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-head" style={{ marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1e1e2d' }}>Today's Sales</h3>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Sales Summary</p>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={fetchSalesData}
          disabled={loading}
        >
          <FiDownload style={{ marginRight: '6px' }} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="sales-summary">
        {stats.map((item, index) => (
          <div key={index} className="stat-card" style={{ background: item.bg }}>
            <div className="stat-icon">{item.icon}</div>
            <h4 className="stat-title">{item.title}</h4>
            <p className="stat-value">{item.value}</p>
            <span className={`stat-delta ${item.change.includes('+') ? 'positive' : item.change.includes('-') ? 'negative' : ''}`}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}