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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
} from '@mui/material';
import {
  FaSync as RefreshIcon,
  FaSave as SaveIcon,
  FaCalendarAlt as EventIcon,
  FaUtensils as RestaurantIcon,
  FaCheckCircle as CheckCircleIcon,
  FaTimesCircle as CancelIcon,
  FaExclamationTriangle as WarningIcon,
  FaSun as LunchIcon,
  FaMoon as DinnerIcon,
} from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(100);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMembers();
  }, [selectedDate, token, navigate]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const [membersResponse, attendanceResponse] = await Promise.all([
        axios.get(`${API_URL}/api/members`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/attendance/${formattedDate}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const membersWithAttendance = membersResponse.data.data.map(member => {
        const attendance = attendanceResponse.data.data.find(a => a.userId?._id === member._id);
        return {
          ...member,
          lunch: attendance?.lunch || false,
          dinner: attendance?.dinner || false
        };
      });

      setMembers(membersWithAttendance);
    } catch (err) {
      console.error('Error fetching members:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      showSnackbar(err.response?.data?.error || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAttendanceChange = async (memberId, meal) => {
    try {
      const memberToUpdate = members.find(m => m._id === memberId);
      if (!memberToUpdate) return;

      const originalMembers = [...members];
      const optimisticMembers = members.map(member =>
        member._id === memberId ? { ...member, [meal]: !member[meal] } : member
      );
      setMembers(optimisticMembers);

      const newStatus = !memberToUpdate[meal];
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const endpoint = `${API_URL}/api/attendance/${memberId}/${formattedDate}/${meal}`;

      const response = await axios.put(endpoint, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMembers(prevMembers => prevMembers.map(member => {
          if (member._id === memberId) {
            const backendAttendance = response.data.data.attendance;
            const updatedMember = {
                ...member,
                lunch: backendAttendance ? backendAttendance.lunch : member.lunch,
                dinner: backendAttendance ? backendAttendance.dinner : member.dinner,
                remainingTiffinCount: response.data.data.remainingTiffinCount
            };
            if(backendAttendance && typeof backendAttendance[meal] === 'boolean') {
                updatedMember[meal] = backendAttendance[meal];
            }
            return updatedMember;
          }
          return member;
        }));
        showSnackbar('Attendance updated successfully!', 'success');
      } else {
        showSnackbar(response.data.error || 'Failed to update attendance', 'error');
        setMembers(originalMembers);
      }

    } catch (err) {
      console.error('Error updating attendance:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        showSnackbar(err.response?.data?.error || 'Failed to update attendance', 'error');
        fetchMembers();
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  const sortedMembers = [...members].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';

    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Attendance Management
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchMembers} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' }}>
            <TableRow>
              {[
                { id: 'name', label: 'Name', width: '30%' },
                { id: 'lunch', label: 'Lunch', align: 'center', width: '25%' },
                { id: 'dinner', label: 'Dinner', align: 'center', width: '25%' },
                { id: 'remainingTiffinCount', label: 'Remaining Tiffins', width: '20%' },
              ].map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    width: headCell.width
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleSort(headCell.id)}
                    sx={{
                      '&.MuiTableSortLabel-root': { color: 'white' },
                      '&.MuiTableSortLabel-active': { color: 'white' },
                      '& .MuiTableSortLabel-icon': { color: 'white !important' },
                    }}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : sortedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No members found for the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member) => (
                  <TableRow key={member._id} hover>
                    <TableCell 
                      sx={{ 
                        padding: '8px 16px',
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
                    <TableCell align="center" sx={{ padding: '8px 16px' }}>
                      <Tooltip title={member.remainingTiffinCount <= 0 && !member.lunch ? "Tiffins exhausted" : (member.lunch ? "Mark as Absent (Lunch)" : "Mark as Present (Lunch)")}>
                        <span>
                           <Checkbox
                              checked={member.lunch}
                              onChange={() => handleAttendanceChange(member._id, 'lunch')}
                              color="primary"
                              disabled={member.remainingTiffinCount <= 0 && !member.lunch}
                              icon={<LunchIcon />}
                              checkedIcon={<LunchIcon style={{ color: '#4CAF50' }}/>}
                            />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '8px 16px' }}>
                       <Tooltip title={member.remainingTiffinCount <= 0 && !member.dinner ? "Tiffins exhausted" : (member.dinner ? "Mark as Absent (Dinner)" : "Mark as Present (Dinner)")}>
                         <span>
                           <Checkbox
                              checked={member.dinner}
                              onChange={() => handleAttendanceChange(member._id, 'dinner')}
                              color="primary"
                              disabled={member.remainingTiffinCount <= 0 && !member.dinner}
                              icon={<DinnerIcon />}
                              checkedIcon={<DinnerIcon style={{ color: '#9C27B0' }}/>}
                           />
                         </span>
                       </Tooltip>
                    </TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      <Chip
                        label={member.remainingTiffinCount}
                        color={member.remainingTiffinCount > 0 ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(prev => prev + 1)}
            disabled={page >= Math.ceil(members.length / rowsPerPage) - 1}
          >
            Next
          </Button>
        </Box>
      </TableContainer>
    </Container>
  );
};

export default Attendance; 