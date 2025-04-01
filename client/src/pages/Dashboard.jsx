import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi, menuApi } from '../services/api';

const Dashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [todayMenu, setTodayMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user subscription
        const subscriptionResponse = await userApi.getUserSubscription();
        setSubscription(subscriptionResponse.data);

        // Fetch today's menu
        const menuResponse = await menuApi.getTodaysMenu();
        setTodayMenu(menuResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  // Sample subscription data if API call fails
  const sampleSubscription = {
    plan: 'Monthly Plan',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    status: 'Active',
    remainingMeals: 28,
    amount: 3500
  };

  // Sample menu data if API call fails
  const sampleMenu = {
    date: new Date().toISOString().split('T')[0],
    meals: [
      { type: 'Breakfast', items: ['Bread', 'Butter', 'Jam', 'Eggs', 'Tea/Coffee'] },
      { type: 'Lunch', items: ['Rice', 'Dal', 'Mixed Vegetables', 'Chicken Curry', 'Salad'] },
      { type: 'Dinner', items: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal', 'Dessert'] }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Use sample data if API call fails
  const subscriptionData = subscription || sampleSubscription;
  const menuData = todayMenu || sampleMenu;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome, {user?.name || 'User'}!
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your mess management dashboard
          </p>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* Subscription Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Subscription
              </h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subscriptionData.plan}</dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${subscriptionData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {subscriptionData.status}
                      </span>
                    </dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subscriptionData.startDate}</dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subscriptionData.endDate}</dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Remaining Meals</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subscriptionData.remainingMeals}</dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                    <dd className="mt-1 text-sm text-gray-900">₹{subscriptionData.amount}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Today's Menu Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Today's Menu ({new Date().toLocaleDateString()})
              </h3>
              <div className="mt-5 space-y-6">
                {menuData.meals.map((meal, index) => (
                  <div key={index} className="border-t border-gray-200 pt-4">
                    <dt className="text-sm font-medium text-gray-500">{meal.type}</dt>
                    <dd className="mt-2">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {meal.items.map((item, idx) => (
                          <li key={idx} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <span className="ml-2 flex-1 w-0 truncate">{item}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 