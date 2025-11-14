import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";
import { customersAPI } from "../api/customers";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newSignups: 0,
    returningCustomers: 0,
    blockedCustomers: 0
  });

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        search: search.trim() || undefined,
      };

      const response = await customersAPI.getAllCustomers(params);
      
      setCustomers(response.customers || []);
      setTotalPages(response.totalPages || 1);
      setTotalCustomers(response.totalCustomers || 0);
      
      // Calculate stats from the response
      const customersData = response.customers || [];
      const blockedCount = customersData.filter(c => c.status === 'Blocked').length;
      const newCount = customersData.filter(c => c.customerType === 'New').length;
      
      setStats({
        totalCustomers: response.totalCustomers || 0,
        newSignups: newCount,
        returningCustomers: response.totalCustomers - newCount,
        blockedCustomers: blockedCount
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      fetchCustomers();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [search]);

  // Handle customer status toggle
  const handleToggleStatus = async (customerId) => {
    if (window.confirm("Are you sure you want to change this customer's status?")) {
      try {
        await customersAPI.toggleCustomerStatus(customerId);
        // Refresh the customers list
        fetchCustomers();
      } catch (err) {
        console.error('Error toggling customer status:', err);
        alert('Error updating customer status');
      }
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title-wrap">
          <h2 className="page-title">Customers</h2>
          <p className="page-sub">Overview & management</p>
        </div>
        <select
          className="btn btn-outline customers-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      {/* Stats */}
      <div className="customers-stats">
        <div className="customers-stat" style={{ background: "#f3f0ff" }}>
          <p className="customers-stat-value">{stats.totalCustomers.toLocaleString()}</p>
          <p className="customers-stat-title">Total Customers</p>
          <span className="customers-stat-delta">Real-time data</span>
        </div>
        <div className="customers-stat" style={{ background: "#e9fbe9" }}>
          <p className="customers-stat-value">{stats.newSignups}</p>
          <p className="customers-stat-title">New Signups</p>
          <span className="customers-stat-delta">From API data</span>
        </div>
        <div className="customers-stat" style={{ background: "#fff3e6" }}>
          <p className="customers-stat-value">{stats.returningCustomers}</p>
          <p className="customers-stat-title">Returning Customers</p>
          <span className="customers-stat-delta">From API data</span>
        </div>
        <div className="customers-stat" style={{ background: "#ffeef2" }}>
          <p className="customers-stat-value">{stats.blockedCustomers}</p>
          <p className="customers-stat-title">Blocked Customers</p>
          <span className="customers-stat-delta">Currently blocked</span>
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
            onClick={fetchCustomers} 
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="customers-tools">
        <div className="customers-tools-left">
          <span className="muted">Show</span>
          <select
            className="customers-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="muted">entries</span>
        </div>
        <div className="customers-tools-right">
          <div className="customers-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="chip">Orders ▾</button>
          <button className="chip">Spends ▾</button>
          <button className="chip">Commission ▾</button>
        </div>
      </div>

      {/* Table */}
      <div className="card customers-card">
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading customers...</p>
          </div>
        )}
        
        <table className="customers-table">
          <colgroup>
            <col style={{ width: "120px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "220px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>CustomerID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Last OrderDate</th>
              <th>Total orders</th>
              <th>Total spends</th>
              <th>Status</th>
              <th className="center">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.customerId}>
                  <td><span className="tag">#{c.customerId.slice(-6)}</span></td>
                  <td>{c.customerPhone}</td>
                  <td className="muted">{c.customerEmail === 'N/A' ? 'Not provided' : c.customerEmail}</td>
                  <td className="muted">
                    {c.lastOrderDate 
                      ? new Date(c.lastOrderDate).toLocaleDateString() 
                      : "-"
                    }
                  </td>
                  <td>{c.totalOrders}</td>
                  <td>${c.totalSpent.toFixed(2)}</td>
                  <td>
                    <span className={`status ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="center action-col">
                    <Link to={`/customers/${c.customerId}`} className="icon-link eye" title="View">
                      <FiEye />
                    </Link>
                    <button 
                      className="icon-link danger" 
                      onClick={() => handleToggleStatus(c.customerId)}
                      title={`${c.status === 'Blocked' ? 'Activate' : 'Block'} Customer`}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="center muted">
                  {loading ? 'Loading customers...' : 'No customers found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="customers-pager">
          <button className="pager-btn" onClick={() => setPage(1)} disabled={page === 1}>
            «
          </button>
          <button className="pager-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ‹
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`pager-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pager-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            ›
          </button>
          <button
            className="pager-btn"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}