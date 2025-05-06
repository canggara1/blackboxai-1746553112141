import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function POS() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await axios.get(\`\${API_BASE}/inventory/categories\`);
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0]._id);
        }
        const menuRes = await axios.get(\`\${API_BASE}/inventory/menu-items\`);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Failed to fetch inventory', error);
      }
    }
    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => item.category._id === selectedCategory);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(ci => ci.menuItem._id === item._id);
      if (existing) {
        return prevCart.map(ci =>
          ci.menuItem._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        return [...prevCart, { menuItem: item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(ci => ci.menuItem._id !== itemId));
  };

  const total = cart.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full md:w-2/3">
        <div className="flex space-x-4 mb-4">
          {categories.map(cat => (
            <button
              key={cat._id}
              className={\`px-4 py-2 rounded \${selectedCategory === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div key={item._id} className="border rounded p-2 cursor-pointer hover:shadow-lg" onClick={() => addToCart(item)}>
              <img src={item.imageUrl || 'https://images.pexels.com/photos/1659492/pexels-photo-1659492.jpeg'} alt={item.name} className="w-full h-32 object-cover rounded" />
              <h3 className="mt-2 font-semibold">{item.name}</h3>
              <p className="text-gray-600">IDR {item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3 border rounded p-4">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {cart.length === 0 && <p>No items in cart</p>}
        {cart.map(ci => (
          <div key={ci.menuItem._id} className="flex justify-between items-center mb-2">
            <div>
              <p>{ci.menuItem.name} x {ci.quantity}</p>
              <p className="text-sm text-gray-500">IDR {(ci.menuItem.price * ci.quantity).toLocaleString()}</p>
            </div>
            <button className="text-red-500" onClick={() => removeFromCart(ci.menuItem._id)}>Remove</button>
          </div>
        ))}
        <hr className="my-2" />
        <p className="font-semibold">Total: IDR {total.toLocaleString()}</p>
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          disabled={cart.length === 0}
          onClick={() => alert('Proceed to payment (to be implemented)')}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}

export default POS;
