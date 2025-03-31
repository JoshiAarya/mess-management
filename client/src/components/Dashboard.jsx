import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration
  const dummySubscription = {
    plan: 'monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
    price: 2000,
    mealsPerDay: 2
  };

  const dummyMenu = {
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        name: 'Breakfast',
        category: 'breakfast',
        items: [
          { name: 'Idli', price: 40, isVegetarian: true },
          { name: 'Dosa', price: 50, isVegetarian: true },
          { name: 'Tea', price: 20, isVegetarian: true }
        ]
      },
      {
        name: 'Lunch',
        category: 'lunch',
        items: [
          { name: 'Dal', price: 40, isVegetarian: true },
          { name: 'Rice', price: 30, isVegetarian: true },
          { name: 'Mixed Vegetable', price: 50, isVegetarian: true }
        ]
      },
      {
        name: 'Dinner',
        category: 'dinner',
        items: [
          { name: 'Chapati', price: 20, isVegetarian: true },
          { name: 'Paneer Curry', price: 60, isVegetarian: true },
          { name: 'Dal', price: 40, isVegetarian: true }
        ]
      }
    ]
  };

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        setSubscription(dummySubscription);
        setMenu(dummyMenu);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Khanna Mess</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Subscription Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Subscription</h3>
              {subscription ? (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                      <p className="mt-1 text-sm text-gray-900">{subscription.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1 text-sm text-gray-900">{subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="mt-1 text-sm text-gray-900">₹{subscription.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Meals per day</p>
                      <p className="mt-1 text-sm text-gray-900">{subscription.mealsPerDay}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No active subscription</p>
              )}
            </div>
          </div>

          {/* Today's Menu */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Menu</h3>
              {menu ? (
                <div className="mt-4 space-y-6">
                  {menu.items.map((meal, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-900">{meal.name}</h4>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {meal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.name}</span>
                            <span className="text-sm font-medium text-gray-900">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No menu available for today</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 