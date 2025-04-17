import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import {
  FaSync as RefreshIcon,
  FaUtensils as RestaurantIcon,
  FaCheckCircle as CheckCircleIcon,
  FaExclamationTriangle as WarningIcon,
  FaMoneyBillWave as MoneyIcon,
  FaRedo as ReactivateIcon,
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ExhaustedMembers = () => {
  const [exhaustedMembers, setExhaustedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // State for Reactivation Modal
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [reactivatingMember, setReactivatingMember] = useState(null);
  const [reactivateFormData, setReactivateFormData] = useState({
    subscriptionAmount: '',
    maxTiffinCount: '',
  });
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [reactivateError, setReactivateError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExhaustedMembers();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchExhaustedMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/members/exhausted-tiffin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setExhaustedMembers(response.data.data);
      } else {
        setError('Failed to fetch exhausted members list.');
        setExhaustedMembers([]);
      }
    } catch (error) {
      console.error('Error fetching exhausted members:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setError(error.response?.data?.error || 'An error occurred fetching exhausted members.');
    } finally {
      setLoading(false);
    }
  };

  // --- Reactivation Modal Logic (Copied from previous Attendance.js) ---
  const openReactivateModal = (member) => {
    setReactivatingMember(member);
    setReactivateFormData({
      subscriptionAmount: member.subscriptionAmount || '',
      maxTiffinCount: member.maxTiffinCount || '',
    });
    setReactivateError(null);
    setReactivateModalOpen(true);
  };

  const closeReactivateModal = () => {
    setReactivateModalOpen(false);
    setReactivatingMember(null);
    setReactivateFormData({ subscriptionAmount: '', maxTiffinCount: '' });
    setReactivateLoading(false);
  };

  const handleReactivateFormChange = (e) => {
    setReactivateFormData({
      ...reactivateFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleReactivateSubmit = async (e) => {
    e.preventDefault();
    if (!reactivatingMember) return;

    setReactivateLoading(true);
    setReactivateError(null);

    try {
      const payload = {
        subscriptionAmount: parseFloat(reactivateFormData.subscriptionAmount),
        maxTiffinCount: parseInt(reactivateFormData.maxTiffinCount, 10),
      };

      if (isNaN(payload.subscriptionAmount) || payload.subscriptionAmount <= 0 ||
          isNaN(payload.maxTiffinCount) || payload.maxTiffinCount <= 0) {
        setReactivateError("Please enter valid positive numbers for amount and tiffin count.");
        setReactivateLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/members/${reactivatingMember._id}/reactivate`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSnackbar(`Member ${reactivatingMember.name} reactivated successfully!`, 'success');
        closeReactivateModal();
        fetchExhaustedMembers(); // Refresh the list after reactivation
      } else {
         setReactivateError(response.data.error || 'Failed to reactivate member.');
      }
    } catch (err) {
      console.error('Error reactivating member:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setReactivateError(err.response?.data?.error || 'An error occurred during reactivation.');
    } finally {
      setReactivateLoading(false);
    }
  };
  // --- End Reactivation Modal Logic ---

  // --- Snackbar Logic ---
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  // --- End Snackbar Logic ---

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Exhausted Tiffin Members
        </Typography>
        <Tooltip title="Refresh List">
          <IconButton onClick={fetchExhaustedMembers} color="primary" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : exhaustedMembers.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', background: '#e3f2fd' }}>
           <WarningIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
          <Typography variant="h6">No members currently have exhausted tiffins.</Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(135deg, #ffb74d 0%, #ffa726 100%)' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hostel</TableCell>
                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Current Tiffins</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exhaustedMembers.map((member) => (
                  <TableRow key={member._id} hover>
                    <TableCell 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'primary.main'
                        }
                      }} 
                      onClick={() => navigate(`/members/${member._id}`)}
                    >
                      {member.name}
                    </TableCell>
                     <TableCell>{member.hostelName}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${member.remainingTiffinCount} / ${member.maxTiffinCount}`}
                        color="error"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<ReactivateIcon />}
                        onClick={() => openReactivateModal(member)}
                      >
                        Reactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Reactivation Modal */}
      <Dialog open={reactivateModalOpen} onClose={closeReactivateModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Reactivate Member: {reactivatingMember?.name}
        </DialogTitle>
        <form onSubmit={handleReactivateSubmit}>
          <DialogContent>
             {reactivateError && (
               <Alert severity="error" sx={{ mb: 2 }}>{reactivateError}</Alert>
             )}
            <TextField
              autoFocus
              margin="dense"
              name="subscriptionAmount"
              label="New Subscription Amount"
              type="number"
              fullWidth
              value={reactivateFormData.subscriptionAmount}
              onChange={handleReactivateFormChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
                 inputProps: { min: 0.01, step: 0.01 }
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="maxTiffinCount"
              label="New Max Tiffin Count"
              type="number"
              fullWidth
              value={reactivateFormData.maxTiffinCount}
              onChange={handleReactivateFormChange}
              required
               InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantIcon />
                  </InputAdornment>
                ),
                inputProps: { min: 1, step: 1 }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={closeReactivateModal} disabled={reactivateLoading}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={reactivateLoading}
              startIcon={reactivateLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            >
              {reactivateLoading ? 'Reactivating...' : 'Reactivate Member'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ExhaustedMembers; 