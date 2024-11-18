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
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  CalendarMonth as CalendarIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalHours: 0,
    presentDays: 0,
    absentDays: 0,
    averageHours: 0
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance`);
      setAttendances(response.data);
      
      // Calculate stats
      const totalHours = response.data.reduce((sum, att) => {
        const duration = moment.duration(moment(att.checkOut).diff(moment(att.checkIn)));
        return sum + duration.asHours();
      }, 0);

      const presentDays = response.data.length;
      const totalDays = moment().diff(moment().subtract(30, 'days'), 'days');
      const absentDays = totalDays - presentDays;
      const averageHours = totalHours / presentDays || 0;

      setStats({
        totalHours: Math.round(totalHours * 10) / 10,
        presentDays,
        absentDays,
        averageHours: Math.round(averageHours * 10) / 10
      });
    } catch (error) {
      setError('Failed to fetch attendance records');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/attendance/check-in`);
      setSuccess('Checked in successfully');
      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/attendance/check-out`);
      setSuccess('Checked out successfully');
      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check out');
    }
  };

  const filteredAttendances = attendances.filter(attendance =>
    moment(attendance.date).format('YYYY-MM-DD').includes(searchTerm)
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
        Attendance Management
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Hours"
            value={`${stats.totalHours}h`}
            icon={<AccessTimeIcon />}
            color="#4B49AC"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Present Days"
            value={stats.presentDays}
            icon={<CheckCircleIcon />}
            color="#7DA0FA"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Absent Days"
            value={stats.absentDays}
            icon={<CancelIcon />}
            color="#F3797E"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Average Hours/Day"
            value={`${stats.averageHours}h`}
            icon={<TimerIcon />}
            color="#7978E9"
          />
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          size="small"
          type="date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarIcon sx={{ color: 'text.secondary' }} />
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
            onClick={fetchAttendance}
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
            startIcon={<AccessTimeIcon />}
            onClick={handleCheckIn}
            sx={{ 
              mr: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#4B49AC',
              '&:hover': {
                backgroundColor: '#3f3e8f',
              }
            }}
          >
            Check In
          </Button>
          <Button
            variant="contained"
            startIcon={<TimerIcon />}
            onClick={handleCheckOut}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#F3797E',
              '&:hover': {
                backgroundColor: '#e66b70',
              }
            }}
          >
            Check Out
          </Button>
        </Box>
      </Box>

      {/* Attendance Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredAttendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendances
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((attendance) => {
                  const duration = moment.duration(
                    moment(attendance.checkOut).diff(moment(attendance.checkIn))
                  );
                  const hours = Math.floor(duration.asHours());
                  const minutes = Math.floor(duration.asMinutes()) % 60;

                  return (
                    <TableRow key={attendance._id} hover>
                      <TableCell>
                        {moment(attendance.date).format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell>
                        {moment(attendance.checkIn).format('hh:mm A')}
                      </TableCell>
                      <TableCell>
                        {attendance.checkOut ? 
                          moment(attendance.checkOut).format('hh:mm A') : 
                          'Not checked out'
                        }
                      </TableCell>
                      <TableCell>
                        {attendance.checkOut ? 
                          `${hours}h ${minutes}m` : 
                          'In progress'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attendance.checkOut ? 'Completed' : 'In Progress'}
                          size="small"
                          sx={{ 
                            backgroundColor: attendance.checkOut ? 
                              'rgba(75, 73, 172, 0.1)' : 
                              'rgba(243, 121, 126, 0.1)',
                            color: attendance.checkOut ? '#4B49AC' : '#F3797E',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredAttendances.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

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

export default AttendanceList; 