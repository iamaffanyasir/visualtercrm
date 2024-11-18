import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Divider,
  LinearProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Gavel,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  CalendarToday,
  Assignment,
  AccessTime
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCases: 0,
    totalClients: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    revenueChange: 12.5, // Percentage change from last month
    caseChange: 8.2,     // Percentage change from last month
    clientChange: 5.7    // Percentage change from last month
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([
    { id: 1, title: 'Client Meeting - Johnson Case', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Document Review - Smith vs. Corp', time: '2:00 PM', type: 'review' },
    { id: 3, title: 'Court Hearing - Davis Case', time: '4:00 PM', type: 'hearing' }
  ]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [casesRes, clientsRes, invoicesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/cases`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/clients`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/invoices`)
      ]);

      // Calculate stats
      const activeCases = casesRes.data.filter(c => c.status !== 'closed').length;
      const totalClients = clientsRes.data.length;
      const pendingInvoices = invoicesRes.data.filter(i => i.status === 'pending').length;
      const totalRevenue = invoicesRes.data
        .filter(i => i.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      setStats({
        ...stats,
        activeCases,
        totalClients,
        pendingInvoices,
        totalRevenue
      });

      setRecentCases(casesRes.data.slice(0, 5));
      setRecentInvoices(invoicesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, change, color }) => (
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
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            {title}
          </Typography>
        </Box>
        {change && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              py: 0.5,
              px: 1,
              width: 'fit-content'
            }}
          >
            {change > 0 ? (
              <ArrowUpward sx={{ fontSize: '1rem', mr: 0.5 }} />
            ) : (
              <ArrowDownward sx={{ fontSize: '1rem', mr: 0.5 }} />
            )}
            <Typography variant="caption">
              {Math.abs(change)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const TaskCard = ({ task }) => {
    const getTaskIcon = (type) => {
      switch (type) {
        case 'meeting': return <People color="primary" />;
        case 'review': return <Assignment color="warning" />;
        case 'hearing': return <Gavel color="error" />;
        default: return <AccessTime />;
      }
    };

    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 2,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(5px)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
            background: 'rgba(255, 255, 255, 0.7)',
          }
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'background.paper',
            mr: 2,
            boxShadow: 2,
          }}
        >
          {getTaskIcon(task.type)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
            {task.title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {task.time}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        pt: 2, 
        pb: 4 
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ pt: 2, pb: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {currentUser?.email?.split('@')[0]}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Here's what's happening with your cases today.
            </Typography>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Cases"
                value={stats.activeCases}
                icon={<Gavel />}
                change={stats.caseChange}
                color="#4B49AC"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Clients"
                value={stats.totalClients}
                icon={<People />}
                change={stats.clientChange}
                color="#7DA0FA"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Invoices"
                value={stats.pendingInvoices}
                icon={<Assignment />}
                color="#7978E9"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={<AttachMoney />}
                change={stats.revenueChange}
                color="#F3797E"
              />
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Recent Cases</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/cases')}
                    >
                      View All Cases
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {recentCases.map((case_, index) => (
                    <Box key={case_._id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">{case_.title}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: case_.status === 'open' ? 'primary.light' : 'success.light',
                            color: case_.status === 'open' ? 'primary.main' : 'success.main'
                          }}
                        >
                          {case_.status}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Client: {case_.client?.name}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={case_.status === 'closed' ? 100 : 60}
                        sx={{ mb: 1 }}
                      />
                      {index < recentCases.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Recent Invoices</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/invoices')}
                    >
                      View All Invoices
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {recentInvoices.map((invoice, index) => (
                    <Box key={invoice._id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1">
                            INV-{invoice._id.slice(-6)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {invoice.client?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle1">
                            ${invoice.amount.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: invoice.status === 'paid' ? 'success.light' : 'warning.light',
                              color: invoice.status === 'paid' ? 'success.main' : 'warning.main'
                            }}
                          >
                            {invoice.status}
                          </Typography>
                        </Box>
                      </Box>
                      {index < recentInvoices.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1 }} />
                    <Typography variant="h6">Today's Schedule</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {todaysTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/calendar')}
                  >
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<People />}
                        onClick={() => navigate('/clients/new')}
                      >
                        New Client
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Gavel />}
                        onClick={() => navigate('/cases/new')}
                      >
                        New Case
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AttachMoney />}
                        onClick={() => navigate('/invoices/new')}
                      >
                        New Invoice
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Assignment />}
                        onClick={() => navigate('/reports')}
                      >
                        Reports
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 