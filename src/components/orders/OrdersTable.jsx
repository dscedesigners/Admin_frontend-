import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./OrdersTable.css"; 
import { ordersAPI } from "../../api/orders";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPaymentMode, setFilterPaymentMode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    canceled: 0
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: search.trim() || undefined,
        paymentMode: filterPaymentMode || undefined,
        status: filterStatus || undefined
      };

      const response = await ordersAPI.getAllOrders(params);
      
      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 1);
      setTotalOrders(response.totalOrders || 0);
      
      // Calculate stats from response
      const ordersData = response.orders || [];
      setOrderStats({
        total: response.totalOrders || 0,
        delivered: ordersData.filter(o => o.status === 'Delivered').length,
        inTransit: ordersData.filter(o => o.status === 'Process' || o.status === 'In Transit').length,
        canceled: ordersData.filter(o => o.status === 'Canceled').length
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchOrders();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [search, filterPaymentMode, filterStatus]);

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status');
    }
  };

  // Get unique payment modes and statuses for filters
  const paymentModes = [...new Set(orders.map(o => o.paymentMode).filter(Boolean))];
  const statuses = [...new Set(orders.map(o => o.status).filter(Boolean))];

  const goPrev = () => { 
    if (currentPage > 1) setCurrentPage(p => p - 1); 
  };
  
  const goNext = () => { 
    if (currentPage < totalPages) setCurrentPage(p => p + 1); 
  };
  
  const gotoPage = (n) => setCurrentPage(n);

  const statusClasses = (status) => {
    switch (status) {
      case "Delivered": return "status delivered";
      case "Process": 
      case "In Transit": return "status process";
      case "Canceled": return "status canceled";
      default: return "status";
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="orders-container">
      {/* Summary Cards */}
      <div className="dash-cards">
        <div className="dash-card purple">
          <div className="dash-value">{orderStats.total}</div>
          <div className="dash-label">Total Orders</div>
          <div className="dash-trend up">Real-time data</div>
        </div>
        <div className="dash-card green">
          <div className="dash-value">{orderStats.delivered}</div>
          <div className="dash-label">Delivered Orders</div>
          <div className="dash-trend up">From API data</div>
        </div>
        <div className="dash-card yellow">
          <div className="dash-value">{orderStats.inTransit}</div>
          <div className="dash-label">In Transit</div>
          <div className="dash-trend up">From API data</div>
        </div>
        <div className="dash-card red">
          <div className="dash-value">{orderStats.canceled}</div>
          <div className="dash-label">Canceled Orders</div>
          <div className="dash-trend down">From API data</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          Error: {error}
          <button 
            onClick={fetchOrders} 
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="show-entries">
          Show
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          Entries
        </div>
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
          />
        </div>
        <select value={filterPaymentMode} onChange={e => setFilterPaymentMode(e.target.value)}>
          <option value="">Payment Mode</option>
          {paymentModes.map((pm) => (
            <option key={pm} value={pm}>{pm}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Status</option>
          {statuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading orders...</p>
        </div>
      )}

      {/* Table */}
      <div className="orders-table-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <tr key={order._id || order.orderId} className={idx % 2 !== 0 ? "alt-row" : ""}>
                  <td>#{(order._id || order.orderId)?.slice(-6)}</td>
                  <td className="td-product">
                    {order.product?.image ? (
                      <img src={order.product.image} alt={order.product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <span>{order.product?.name || order.productName || 'N/A'}</span>
                  </td>
                  <td>{order.customerName || order.customer || 'N/A'}</td>
                  <td className="td-date">
                    {order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString() 
                      : order.date || 'N/A'
                    }
                  </td>
                  <td className="td-amount">${(order.totalAmount || order.amount || 0).toFixed(2)}</td>
                  <td>{order.paymentMode || 'N/A'}</td>
                  <td>
                    <span className={statusClasses(order.status)}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action edit" 
                      onClick={() => handleStatusUpdate(order._id || order.orderId, 'Delivered')}
                      title="Mark as Delivered"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      className="action del"
                      onClick={() => handleStatusUpdate(order._id || order.orderId, 'Canceled')}
                      title="Cancel Order"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">
                  {loading ? 'Loading orders...' : 'No orders found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pages">
        <button onClick={goPrev} disabled={currentPage === 1} className="page-btn">
          Previous
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => gotoPage(n)}
            className={"page-num" + (currentPage === n ? " active" : "")}
          >
            {n}
          </button>
        ))}
        <button onClick={goNext} disabled={currentPage === totalPages} className="page-btn">
          Next
        </button>
      </div>
    </div>
  );
}