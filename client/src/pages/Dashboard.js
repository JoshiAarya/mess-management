import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    todaysAttendance: 0,
    monthlyRevenue: 0,
    pendingTasks: 3,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [membersRes, attendanceRes, revenueRes] = await Promise.all([
          axios.get(`${API_URL}/api/members`, { headers }),
          axios.get(`${API_URL}/api/attendance/today/count`, { headers }),
          axios.get(`${API_URL}/api/stats/monthly-revenue`, { headers })
        ]);

        setStats(prevStats => ({
          ...prevStats,
          totalMembers: membersRes.data.count || 0,
          todaysAttendance: attendanceRes.data.count || 0,
          monthlyRevenue: revenueRes.data.revenue || 0,
        }));

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data.');
         if (err.response?.status === 401) {
           logout();
           navigate('/login');
         }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color, isLoading }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150,
        background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
        color: 'white',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
        position: 'relative',
      }}
    >
      {isLoading ? (
        <CircularProgress color="inherit" size={40} />
      ) : (
        <>
          <Box sx={{ fontSize: '2.5rem', mb: 1 }}>{icon}</Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {title === "Monthly Revenue" ? `₹${value.toLocaleString('en-IN')}` : value}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Welcome to Mess Manager
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Manage your mess operations efficiently
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<i className="fas fa-users"></i>}
            color="#2196F3"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Today's Attendance"
            value={stats.todaysAttendance}
            icon={<i className="fas fa-clipboard-check"></i>}
            color="#4CAF50"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            icon={<i className="fas fa-rupee-sign"></i>}
            color="#9C27B0"
            isLoading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/members')}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                  },
                }}
              >
                <i className="fas fa-users mr-2"></i>
                Manage Members
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/attendance')}
                sx={{
                  background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                  },
                }}
              >
                <i className="fas fa-clipboard-check mr-2"></i>
                Manage Attendance
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Account Management
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                background: 'linear-gradient(45deg, #FF5252 30%, #FF8A80 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #D32F2F 30%, #EF5350 90%)',
                },
              }}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 