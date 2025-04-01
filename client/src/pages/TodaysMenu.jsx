import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuApi } from '../services/api';

const TodaysMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTodaysMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await menuApi.getTodaysMenu();
        setMenu(response.data);
      } catch (err) {
        console.error('Error fetching today\'s menu:', err);
        setError('Failed to load today\'s menu. Please try again later.');
        
        // Set sample menu if API call fails
        setMenu({
          date: new Date().toISOString().split('T')[0],
          meals: [
            { type: 'Breakfast', items: ['Bread', 'Butter', 'Jam', 'Eggs', 'Tea/Coffee'] },
            { type: 'Lunch', items: ['Rice', 'Dal', 'Mixed Vegetables', 'Chicken Curry', 'Salad'] },
            { type: 'Dinner', items: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal', 'Dessert'] }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysMenu();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loading today's menu...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Today's Menu
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        {menu && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-8">
                {menu.meals.map((meal, index) => (
                  <div key={index} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {meal.type}
                    </h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {meal.items.map((item, idx) => (
                          <li key={idx} className="px-6 py-4 flex items-center">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysMenu; 