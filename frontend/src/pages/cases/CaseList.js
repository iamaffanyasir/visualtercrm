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
  Gavel as GavelIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    closed: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });

  useEffect(() => {
    fetchCases();
    fetchClients();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cases`);
      setCases(response.data);
      
      // Calculate stats
      setStats({
        total: response.data.length,
        active: response.data.filter(c => c.status !== 'closed').length,
        closed: response.data.filter(c => c.status === 'closed').length
      });
    } catch (error) {
      setError('Failed to fetch cases');
      console.error('Error fetching cases:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/cases/${selectedCase._id}`, formData);
        setSuccess('Case updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cases`, formData);
        setSuccess('Case added successfully');
      }
      setOpen(false);
      fetchCases();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (case_) => {
    setSelectedCase(case_);
    setFormData({
      title: case_.title,
      clientId: case_.client?._id,
      description: case_.description,
      status: case_.status,
      priority: case_.priority
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cases/${caseId}`);
        setSuccess('Case deleted successfully');
        fetchCases();
      } catch (error) {
        setError('Failed to delete case');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      clientId: '',
      description: '',
      status: 'open',
      priority: 'medium'
    });
    setEditMode(false);
    setSelectedCase(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#4B49AC',
      in_progress: '#7DA0FA',
      closed: '#7978E9'
    };
    return colors[status] || '#4B49AC';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#F3797E',
      medium: '#7DA0FA',
      low: '#7978E9'
    };
    return colors[priority] || '#7DA0FA';
  };

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        Case Management
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Cases"
            value={stats.total}
            icon={<GavelIcon />}
            color="#4B49AC"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Cases"
            value={stats.active}
            icon={<AssignmentIcon />}
            color="#7DA0FA"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Closed Cases"
            value={stats.closed}
            icon={<ScheduleIcon />}
            color="#7978E9"
          />
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search cases..."
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
            onClick={fetchCases}
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
            Add Case
          </Button>
        </Box>
      </Box>

      {/* Cases Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
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
            ) : filteredCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No cases found
                </TableCell>
              </TableRow>
            ) : (
              filteredCases
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((case_) => (
                  <TableRow key={case_._id} hover>
                    <TableCell>{case_.title}</TableCell>
                    <TableCell>{case_.client?.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={case_.status}
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(case_.status)}20`,
                          color: getStatusColor(case_.status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={case_.priority}
                        size="small"
                        sx={{ 
                          backgroundColor: `${getPriorityColor(case_.priority)}20`,
                          color: getPriorityColor(case_.priority),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {moment(case_.createdAt).format('MMM DD, YYYY')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(case_)}
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
                          onClick={() => handleDelete(case_._id)} 
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
          count={filteredCases.length}
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
        <DialogTitle>{editMode ? 'Edit Case' : 'Add New Case'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
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

export default CaseList; 