import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../api/dashboard";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getTopProducts(4);
      setProducts(response.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch top products');
      console.error('Top products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductColor = (index) => {
    const colors = ["#4a90e2", "#2ecc71", "#9b59b6", "#e67e22", "#f39c12"];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="card top-products-card">
        <h3 className="top-products-title">Top Products</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading top products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card top-products-card">
        <h3 className="top-products-title">Top Products</h3>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {error}
          <button onClick={fetchTopProducts} style={{ display: 'block', margin: '10px auto' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card top-products-card">
      <div className="card-head">
        <h3 className="top-products-title">Top Products</h3>
        <button className="btn btn-outline" onClick={fetchTopProducts}>
          Refresh
        </button>
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No sales data available yet. Create some orders to see top products.
        </div>
      ) : (
        <table className="top-products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Popularity</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const color = getProductColor(index);
              return (
                <tr key={product._id}>
                  <td>{product.rank || index + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {product.thumbnail && (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            borderRadius: '4px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                        {product.brand && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {product.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="popularity-bar">
                      <div
                        className="popularity-fill"
                        style={{
                          width: `${product.popularity}%`,
                          backgroundColor: color,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="sales-badge"
                      style={{
                        color: color,
                        borderColor: color,
                        backgroundColor: '#fff',
                      }}
                    >
                      {product.totalQuantitySold} sold
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}