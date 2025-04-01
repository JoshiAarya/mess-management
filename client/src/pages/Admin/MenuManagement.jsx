import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menuApi } from '../../services/api';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meals: [
      { type: 'Breakfast', items: [''] },
      { type: 'Lunch', items: [''] },
      { type: 'Dinner', items: [''] }
    ]
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

    // Fetch menus for the next 7 days
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const startDate = today.toISOString().split('T')[0];
        const endDate = nextWeek.toISOString().split('T')[0];
        
        const response = await menuApi.getMenusByDateRange(startDate, endDate);
        setMenus(response.data);
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError('Failed to load menus. Please try again later.');
        
        // Use dummy data for demonstration
        const today = new Date();
        const menuList = [];
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          menuList.push({
            _id: `menu-${i}`,
            date: date.toISOString().split('T')[0],
            meals: [
              { 
                type: 'Breakfast', 
                items: i % 2 === 0 
                  ? ['Bread', 'Butter', 'Jam', 'Boiled Eggs', 'Tea/Coffee'] 
                  : ['Poha', 'Upma', 'Fruit Bowl', 'Tea/Coffee']
              },
              { 
                type: 'Lunch', 
                items: i % 3 === 0 
                  ? ['Rice', 'Dal', 'Mixed Vegetables', 'Chicken Curry', 'Salad', 'Papad'] 
                  : ['Chapati', 'Rice', 'Dal Makhani', 'Paneer Butter Masala', 'Salad', 'Pickle']
              },
              { 
                type: 'Dinner', 
                items: i % 2 === 1 
                  ? ['Chapati', 'Rice', 'Dal Tadka', 'Aloo Gobi', 'Raita', 'Sweet'] 
                  : ['Chapati', 'Jeera Rice', 'Dal Fry', 'Egg Curry', 'Salad', 'Ice Cream']
              }
            ]
          });
        }
        
        setMenus(menuList);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // In a real app, you would call the API
      // await menuApi.createMenu(formData);
      
      // For demo, just add to the local state
      const newMenu = {
        _id: Date.now().toString(),
        ...formData
      };
      
      // Check if menu already exists for this date
      const existingMenuIndex = menus.findIndex(menu => menu.date === formData.date);
      if (existingMenuIndex >= 0) {
        // Replace existing menu
        const updatedMenus = [...menus];
        updatedMenus[existingMenuIndex] = newMenu;
        setMenus(updatedMenus);
      } else {
        // Add new menu
        setMenus([...menus, newMenu]);
      }
      
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        meals: [
          { type: 'Breakfast', items: [''] },
          { type: 'Lunch', items: [''] },
          { type: 'Dinner', items: [''] }
        ]
      });
      
      alert('Menu created successfully!');
    } catch (err) {
      console.error('Error creating menu:', err);
      alert('Failed to create menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      setLoading(true);
      
      // In a real app, you would call the API
      // await menuApi.deleteMenu(id);
      
      // For demo, just update the local state
      setMenus(menus.filter(menu => menu._id !== id));
      
      alert('Menu deleted successfully!');
    } catch (err) {
      console.error('Error deleting menu:', err);
      alert('Failed to delete menu. Please try again.');
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
  };

  const handleMealItemChange = (mealIndex, itemIndex, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items[itemIndex] = value;
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };

  const addMealItem = (mealIndex) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items.push('');
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };

  const removeMealItem = (mealIndex, itemIndex) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items.splice(itemIndex, 1);
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Menu Management
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {showForm ? 'Cancel' : 'Create New Menu'}
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
                Create New Menu
              </h3>
              <form onSubmit={handleCreateMenu} className="mt-5 space-y-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {formData.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">{meal.type}</h4>
                    </div>
                    
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          required
                          value={item}
                          onChange={(e) => handleMealItemChange(mealIndex, itemIndex, e.target.value)}
                          placeholder={`${meal.type} item ${itemIndex + 1}`}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        
                        <button
                          type="button"
                          onClick={() => removeMealItem(mealIndex, itemIndex)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          disabled={meal.items.length <= 1}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addMealItem(mealIndex)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Item
                    </button>
                  </div>
                ))}

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
                    Create Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && !showForm ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading menus...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menus.sort((a, b) => new Date(a.date) - new Date(b.date)).map((menu) => (
              <div key={menu._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {new Date(menu.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/menu/${menu._id}`}
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteMenu(menu._id)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 space-y-6">
                    {menu.meals.map((meal, index) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement; 