import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  FaMoneyBillWave as MoneyIcon,
  FaHistory as HistoryIcon
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: ''
  });
  const [paymentError, setPaymentError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching member data for ID:', id);
        console.log('Using token:', token ? 'Token present' : 'No token');
        
        // Fetch member details
        const memberResponse = await axios.get(`http://localhost:5000/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Member response:', memberResponse.data);
        setMember(memberResponse.data.data);

        // Fetch attendance history
        const attendanceResponse = await axios.get(`http://localhost:5000/api/attendance/member/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Attendance response:', attendanceResponse.data);
        setAttendanceHistory(attendanceResponse.data.data);
      } catch (err) {
        console.error('Detailed error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        setError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          'Failed to fetch member data. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchData();
    } else {
      setError('Missing member ID or authentication token');
      setLoading(false);
    }
  }, [id, token]);

  const handlePaymentDialogOpen = () => {
    setPaymentDialogOpen(true);
    setPaymentForm({ amount: '', description: '' });
    setPaymentError(null);
  };

  const handlePaymentDialogClose = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentFormChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/members/${id}/payment`,
        paymentForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMember(response.data.data);
      handlePaymentDialogClose();
    } catch (err) {
      setPaymentError(
        err.response?.data?.error || 
        'Failed to record payment. Please try again.'
      );
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/members')}
            sx={{ mt: 2 }}
          >
            Back to Members
          </Button>
        </Box>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">Member not found</Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/members')}
            sx={{ mt: 2 }}
          >
            Back to Members
          </Button>
        </Box>
      </Container>
    );
  }

  const remainingAmount = member.subscriptionAmount - member.totalPaidAmount;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="member profile tabs">
        <Tab label="Details" />
        <Tab label="Payment History" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Member Details
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {member.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Hostel:</strong> {member.hostelName}
                </Typography>
                <Typography variant="body1">
                  <strong>College:</strong> {member.collegeName}
                </Typography>
                <Typography variant="body1">
                  <strong>WhatsApp:</strong> {member.whatsappNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Subscription Amount:</strong> ₹{member.subscriptionAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Paid Amount:</strong> ₹{member.totalPaidAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Remaining Amount:</strong> ₹{remainingAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Max Tiffin Count:</strong> {member.maxTiffinCount}
                </Typography>
                <Typography variant="body1">
                  <strong>Remaining Tiffin Count:</strong> {member.remainingTiffinCount}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MoneyIcon />}
                  onClick={handlePaymentDialogOpen}
                  sx={{ mt: 2 }}
                >
                  Record Payment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Attendance History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Lunch</TableCell>
                        <TableCell align="center">Dinner</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceHistory.length > 0 ? (
                        attendanceHistory.map((record) => (
                          <TableRow key={record._id || record.date}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                              {record.lunch !== undefined ? (
                                <Chip
                                  label={record.lunch ? 'Present' : 'Absent'}
                                  color={record.lunch ? 'success' : 'default'}
                                  size="small"
                                />
                              ) : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                              {record.dinner !== undefined ? (
                                <Chip
                                  label={record.dinner ? 'Present' : 'Absent'}
                                  color={record.dinner ? 'success' : 'default'}
                                  size="small"
                                />
                              ) : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Payment History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {member.paymentHistory.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{payment.amount}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog open={paymentDialogOpen} onClose={handlePaymentDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <form onSubmit={handlePaymentSubmit}>
          <DialogContent>
            {paymentError && (
              <Alert severity="error" sx={{ mb: 2 }}>{paymentError}</Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={paymentForm.amount}
              onChange={handlePaymentFormChange}
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
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={paymentForm.description}
              onChange={handlePaymentFormChange}
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePaymentDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Record Payment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MemberProfile; 