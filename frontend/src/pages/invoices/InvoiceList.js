import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
  Card,
  CardContent,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  });

  const [formData, setFormData] = useState({
    clientId: '',
    caseId: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    description: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchCases();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices`);
      setInvoices(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(inv => inv.status === 'pending').length;
      const overdue = response.data.filter(inv => 
        inv.status === 'pending' && moment(inv.dueDate).isBefore(moment())
      ).length;
      const totalAmount = response.data.reduce((sum, inv) => sum + inv.amount, 0);

      setStats({ total, pending, overdue, totalAmount });
    } catch (error) {
      setError('Failed to fetch invoices');
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cases`);
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/invoices/${selectedInvoice._id}`, formData);
        setSuccess('Invoice updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/invoices`, formData);
        setSuccess('Invoice added successfully');
      }
      setOpen(false);
      fetchInvoices();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      clientId: invoice.client?._id,
      caseId: invoice.case?._id,
      amount: invoice.amount,
      dueDate: moment(invoice.dueDate).format('YYYY-MM-DD'),
      status: invoice.status,
      description: invoice.description || ''
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/invoices/${invoiceId}`);
        setSuccess('Invoice deleted successfully');
        fetchInvoices();
      } catch (error) {
        setError('Failed to delete invoice');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      caseId: '',
      amount: '',
      dueDate: '',
      status: 'pending',
      description: ''
    });
    setEditMode(false);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#7DA0FA',
      paid: '#4B49AC',
      overdue: '#F3797E'
    };
    return colors[status] || '#4B49AC';
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon, color }) => (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        backgroundColor: color,
        color: 'white',
        borderRadius: 2,
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ ml: 'auto' }}>
            <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Management
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Invoices"
            value={stats.total}
            icon={<ReceiptIcon />}
            color="#4B49AC"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending Invoices"
            value={stats.pending}
            icon={<ScheduleIcon />}
            color="#7DA0FA"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Overdue Invoices"
            value={stats.overdue}
            icon={<ScheduleIcon />}
            color="#F3797E"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount.toLocaleString()}`}
            icon={<AttachMoneyIcon />}
            color="#7978E9"
          />
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInvoices}
            sx={{ 
              mr: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#4B49AC',
              '&:hover': {
                backgroundColor: '#3f3e8f',
              }
            }}
          >
            Create Invoice
          </Button>
        </Box>
      </Box>

      {/* Invoices Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <TableRow key={invoice._id} hover>
                    <TableCell>INV-{invoice._id.slice(-6)}</TableCell>
                    <TableCell>{invoice.client?.name}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(invoice.status)}20`,
                          color: getStatusColor(invoice.status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {moment(invoice.dueDate).format('MMM DD, YYYY')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Download PDF">
                        <IconButton 
                          sx={{ 
                            color: '#4B49AC',
                            '&:hover': {
                              backgroundColor: 'rgba(75, 73, 172, 0.1)',
                            }
                          }}
                        >
                          <PdfIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(invoice)}
                          sx={{ 
                            color: '#4B49AC',
                            '&:hover': {
                              backgroundColor: 'rgba(75, 73, 172, 0.1)',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDelete(invoice._id)} 
                          sx={{ 
                            color: '#F3797E',
                            '&:hover': {
                              backgroundColor: 'rgba(243, 121, 126, 0.1)',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredInvoices.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle>{editMode ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.clientId}
                label="Client"
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Case</InputLabel>
              <Select
                value={formData.caseId}
                label="Case"
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              >
                {cases.map((case_) => (
                  <MenuItem key={case_._id} value={case_._id}>
                    {case_.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              margin="normal"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
            <TextField
              fullWidth
              label="Due Date"
              margin="normal"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceList; 