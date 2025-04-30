import { Link } from 'react-router-dom';
import { Order } from '../types/order';

type OrderCardProps = {
  order: Order;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const orderDate =
    order.createdAt instanceof Date
      ? order.createdAt.toLocaleDateString()
      : 'Unknown date';

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>Order #{order.id}</h3>
          <p className="order-date">Placed on {orderDate}</p>
          <p className={`order-status ${order.status}`}>
            {order.status.toUpperCase()}
          </p>
        </div>
        <p className="order-total">${order.total.toFixed(2)}</p>
      </div>

      <div className="order-items">
        {order.items.slice(0, 3).map((item, index) => (
          <div key={index} className="order-item">
            <img
              src={item.image}
              alt={item.title}
              className="order-item-image"
            />
            <div className="order-item-details">
              <p>{item.title}</p>
              <p>
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="more-items">+{order.items.length - 3} more items</p>
        )}
      </div>

      <Link to={`/orders/${order.id}`} className="order-details-link">
        View Order Details
      </Link>
    </div>
  );
};
