import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subscriptionApi } from '../../services/api';

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    plan: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    amount: 3500
  });
  
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    // Fetch subscriptions
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await subscriptionApi.getAllSubscriptions();
        setSubscriptions(response.data);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to load subscriptions. Please try again later.');
        
        // Use dummy data for demonstration
        setSubscriptions([
          { 
            _id: '1', 
            userId: { _id: '1', name: 'John Doe', email: 'john@example.com' },
            plan: 'Monthly',
            startDate: '2025-03-01',
            endDate: '2025-03-31',
            status: 'Active',
            remainingMeals: 26,
            amount: 3500
          },
          { 
            _id: '2', 
            userId: { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
            plan: 'Weekly',
            startDate: '2025-03-15',
            endDate: '2025-03-22',
            status: 'Active',
            remainingMeals: 12,
            amount: 1200
          },
          { 
            _id: '3', 
            userId: { _id: '4', name: 'Sam Wilson', email: 'sam@example.com' },
            plan: 'Monthly',
            startDate: '2025-02-15',
            endDate: '2025-03-15',
            status: 'Expired',
            remainingMeals: 0,
            amount: 3500
          },
          { 
            _id: '4', 
            userId: { _id: '5', name: 'Priya Sharma', email: 'priya@example.com' },
            plan: 'Quarterly',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            status: 'Active',
            remainingMeals: 34,
            amount: 9000
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // In a real app, you would call the API
      // await subscriptionApi.createSubscription(formData);
      
      // For demo, just add to the local state
      const newSubscription = {
        _id: Date.now().toString(),
        userId: { 
          _id: formData.userId, 
          name: 'New User', 
          email: 'newuser@example.com' 
        },
        plan: formData.plan,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'Active',
        remainingMeals: formData.plan === 'Monthly' ? 30 : formData.plan === 'Weekly' ? 7 : 90,
        amount: formData.amount
      };
      
      setSubscriptions([...subscriptions, newSubscription]);
      setShowForm(false);
      setFormData({
        userId: '',
        plan: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        amount: 3500
      });
      
      alert('Subscription created successfully!');
    } catch (err) {
      console.error('Error creating subscription:', err);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id) => {
    try {
      setLoading(true);
      
      // In a real app, you would call the API
      // await subscriptionApi.cancelSubscription(id);
      
      // For demo, just update the local state
      setSubscriptions(subscriptions.map(sub => 
        sub._id === id ? { ...sub, status: 'Cancelled' } : sub
      ));
      
      alert('Subscription cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update end date based on plan
    if (name === 'plan') {
      const startDate = new Date(formData.startDate);
      let endDate;
      
      if (value === 'Weekly') {
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        setFormData({
          ...formData,
          plan: value,
          amount: 1200,
          endDate: endDate.toISOString().split('T')[0]
        });
      } else if (value === 'Monthly') {
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        setFormData({
          ...formData,
          plan: value,
          amount: 3500,
          endDate: endDate.toISOString().split('T')[0]
        });
      } else if (value === 'Quarterly') {
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 3);
        setFormData({
          ...formData,
          plan: value,
          amount: 9000,
          endDate: endDate.toISOString().split('T')[0]
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Subscriptions Management
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {showForm ? 'Cancel' : 'Create New Subscription'}
            </button>
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Subscription
              </h3>
              <form onSubmit={handleCreateSubscription} className="mt-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="userId"
                        id="userId"
                        required
                        value={formData.userId}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                      Plan
                    </label>
                    <div className="mt-1">
                      <select
                        id="plan"
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        required
                        value={formData.endDate}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount (₹)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && !showForm ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading subscriptions...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Plan
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Duration
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Remaining Meals
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriptions.map((subscription) => (
                        <tr key={subscription._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {subscription.userId.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {subscription.userId.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{subscription.plan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscription.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : subscription.status === 'Expired'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {subscription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subscription.remainingMeals}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{subscription.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/admin/subscriptions/${subscription._id}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </Link>
                            {subscription.status === 'Active' && (
                              <button
                                onClick={() => handleCancelSubscription(subscription._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsManagement; 