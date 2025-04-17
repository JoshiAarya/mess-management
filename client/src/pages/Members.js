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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Tooltip,
  InputAdornment,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material';
import {
  FaPlus as AddIcon,
  FaEdit as EditIcon,
  FaTrash as DeleteIcon,
  FaUser as PersonIcon,
  FaGraduationCap as SchoolIcon,
  FaHome as HomeIcon,
  FaWhatsapp as WhatsAppIcon,
  FaMoneyBillWave as MoneyIcon,
  FaUtensils as RestaurantIcon,
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(100);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    subscriptionAmount: '',
    maxTiffinCount: '',
    hostelName: '',
    collegeName: '',
    whatsappNumber: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    subscriptionAmount: '',
    maxTiffinCount: '',
    hostelName: '',
    collegeName: '',
    whatsappNumber: ''
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      subscriptionAmount: '',
      maxTiffinCount: '',
      hostelName: '',
      collegeName: '',
      whatsappNumber: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/members', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
      handleClose();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleMemberClick = (id) => {
    navigate(`/members/${id}`);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const handleEditOpen = (member) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name,
      subscriptionAmount: member.subscriptionAmount,
      maxTiffinCount: member.maxTiffinCount,
      hostelName: member.hostelName,
      collegeName: member.collegeName,
      whatsappNumber: member.whatsappNumber
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingMember(null);
    setEditFormData({
      name: '',
      subscriptionAmount: '',
      maxTiffinCount: '',
      hostelName: '',
      collegeName: '',
      whatsappNumber: ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/members/${editingMember._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
      handleEditClose();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Members Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
            },
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          }}
        >
          Add Member
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                  sx={{ color: 'white' }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'subscriptionAmount'}
                  direction={orderBy === 'subscriptionAmount' ? order : 'asc'}
                  onClick={() => handleRequestSort('subscriptionAmount')}
                  sx={{ color: 'white' }}
                >
                  Subscription
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'maxTiffinCount'}
                  direction={orderBy === 'maxTiffinCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('maxTiffinCount')}
                  sx={{ color: 'white' }}
                >
                  Max Tiffin
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'hostelName'}
                  direction={orderBy === 'hostelName' ? order : 'asc'}
                  onClick={() => handleRequestSort('hostelName')}
                  sx={{ color: 'white' }}
                >
                  Hostel
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'collegeName'}
                  direction={orderBy === 'collegeName' ? order : 'asc'}
                  onClick={() => handleRequestSort('collegeName')}
                  sx={{ color: 'white' }}
                >
                  College
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'whatsappNumber'}
                  direction={orderBy === 'whatsappNumber' ? order : 'asc'}
                  onClick={() => handleRequestSort('whatsappNumber')}
                  sx={{ color: 'white' }}
                >
                  WhatsApp
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => {
                const remainingAmount = member.subscriptionAmount - member.totalPaidAmount;
                return (
                  <TableRow
                    key={member._id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleMemberClick(member._id)}
                        sx={{ textTransform: 'none', p: 0 }}
                        startIcon={<PersonIcon />}
                      >
                        {member.name} (₹{remainingAmount} remaining)
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<MoneyIcon />}
                        label={`₹${member.subscriptionAmount}`}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<RestaurantIcon />}
                        label={member.maxTiffinCount}
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<HomeIcon />}
                        label={member.hostelName}
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<SchoolIcon />}
                        label={member.collegeName}
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<WhatsAppIcon />}
                        label={member.whatsappNumber}
                        color="warning"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditOpen(member)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(member._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Add New Member
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="subscriptionAmount"
              label="Subscription Amount"
              type="number"
              fullWidth
              value={formData.subscriptionAmount}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="maxTiffinCount"
              label="Max Tiffin Count"
              type="number"
              fullWidth
              value={formData.maxTiffinCount}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="hostelName"
              label="Hostel Name"
              type="text"
              fullWidth
              value={formData.hostelName}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="collegeName"
              label="College Name"
              type="text"
              fullWidth
              value={formData.collegeName}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="whatsappNumber"
              label="WhatsApp Number"
              type="text"
              fullWidth
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              }}
            >
              Add Member
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Edit Member: {editingMember?.name}
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={editFormData.name}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="subscriptionAmount"
              label="Subscription Amount"
              type="number"
              fullWidth
              value={editFormData.subscriptionAmount}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="maxTiffinCount"
              label="Max Tiffin Count"
              type="number"
              fullWidth
              value={editFormData.maxTiffinCount}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="hostelName"
              label="Hostel Name"
              type="text"
              fullWidth
              value={editFormData.hostelName}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="collegeName"
              label="College Name"
              type="text"
              fullWidth
              value={editFormData.collegeName}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="whatsappNumber"
              label="WhatsApp Number"
              type="text"
              fullWidth
              value={editFormData.whatsappNumber}
              onChange={handleEditChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleEditClose}
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              }}
            >
              Update Member
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Members; 