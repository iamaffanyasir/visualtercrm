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
  Tooltip as MuiTooltip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  Gavel as GavelIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = ['#4B49AC', '#7DA0FA', '#7978E9', '#F3797E', '#98BDF'];

const REPORT_TYPES = {
  FINANCIAL: {
    id: 'financial',
    title: 'Financial Report',
    description: 'Generate a detailed report of all financial transactions, invoices, and revenue analysis.',
    icon: <AttachMoneyIcon />,
    color: '#4B49AC'
  },
  CASES: {
    id: 'cases',
    title: 'Case Analytics',
    description: 'View comprehensive analysis of case progress, outcomes, and performance metrics.',
    icon: <GavelIcon />,
    color: '#7DA0FA'
  },
  CLIENTS: {
    id: 'clients',
    title: 'Client Report',
    description: 'Get insights into client acquisition, retention, and satisfaction metrics.',
    icon: <PeopleIcon />,
    color: '#7978E9'
  },
  PERFORMANCE: {
    id: 'performance',
    title: 'Performance Report',
    description: 'Analyze team performance, case resolution times, and efficiency metrics.',
    icon: <TrendingUpIcon />,
    color: '#F3797E'
  },
  ATTENDANCE: {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'View detailed attendance records, work hours, and time tracking analysis.',
    icon: <AccessTimeIcon />,
    color: '#4CAF50'
  },
  CUSTOM: {
    id: 'custom',
    title: 'Custom Report',
    description: 'Create a customized report with specific metrics and date ranges.',
    icon: <AssessmentIcon />,
    color: '#FF9800'
  }
};

const RevenueChart = ({ data }) => (
  <Card sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#4B49AC" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const CaseStatusChart = ({ data }) => (
  <Card sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>Case Status Distribution</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const ClientAcquisitionChart = ({ data }) => (
  <Card sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>Client Acquisition</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="newClients" fill="#7DA0FA" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

const ReportsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCases: 0,
    totalClients: 0,
    avgCaseLength: 0
  });
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  });
  const [chartData, setChartData] = useState({
    revenue: [],
    caseStatus: [],
    clientAcquisition: []
  });

  useEffect(() => {
    fetchReportData();
    fetchChartData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [casesRes, clientsRes, invoicesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/cases`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/clients`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/invoices`)
      ]);

      // Filter data based on date range
      const filteredInvoices = invoicesRes.data.filter(invoice => 
        moment(invoice.createdAt).isBetween(dateRange.startDate, dateRange.endDate)
      );

      const filteredCases = casesRes.data.filter(case_ => 
        moment(case_.createdAt).isBetween(dateRange.startDate, dateRange.endDate)
      );

      // Calculate stats
      const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      const totalCases = filteredCases.length;
      const totalClients = clientsRes.data.length;
      
      // Calculate average case length for closed cases
      const closedCases = filteredCases.filter(c => c.status === 'closed');
      const avgLength = closedCases.reduce((sum, c) => {
        const duration = moment(c.updatedAt).diff(moment(c.createdAt), 'days');
        return sum + duration;
      }, 0) / (closedCases.length || 1);

      setStats({
        totalRevenue,
        totalCases,
        totalClients,
        avgCaseLength: Math.round(avgLength)
      });
    } catch (error) {
      setError('Failed to fetch report data');
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const [revenueData, caseData, clientData] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/reports/revenue`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/reports/cases`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/reports/clients`)
      ]);

      setChartData({
        revenue: revenueData.data,
        caseStatus: caseData.data,
        clientAcquisition: clientData.data
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleGenerateReport = async (reportType, config) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reports/generate`, {
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        config: config
      }, { responseType: 'blob' });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${moment().format('YYYY-MM-DD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Report generated successfully');
    } catch (error) {
      setError('Failed to generate report');
    }
  };

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

  const ReportCard = ({ title, description, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, color: 'white' }}>
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onClick}
          sx={{ 
            mt: 2,
            backgroundColor: color,
            '&:hover': {
              backgroundColor: color,
              opacity: 0.9
            }
          }}
        >
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );

  const [customReportOpen, setCustomReportOpen] = useState(false);
  const [customReportConfig, setCustomReportConfig] = useState({
    metrics: [],
    format: 'pdf',
    includeCharts: true
  });

  const handleCustomReport = () => {
    setCustomReportOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      {/* Date Range Selector */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchReportData}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<AttachMoneyIcon />}
            color="#4B49AC"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cases"
            value={stats.totalCases}
            icon={<GavelIcon />}
            color="#7DA0FA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<PeopleIcon />}
            color="#7978E9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Case Length"
            value={`${stats.avgCaseLength} days`}
            icon={<DateRangeIcon />}
            color="#F3797E"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <RevenueChart data={chartData.revenue} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CaseStatusChart data={chartData.caseStatus} />
        </Grid>
        <Grid item xs={12}>
          <ClientAcquisitionChart data={chartData.clientAcquisition} />
        </Grid>
      </Grid>

      {/* Report Types */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Available Reports
      </Typography>
      <Grid container spacing={3}>
        {Object.values(REPORT_TYPES).map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <ReportCard
              title={report.title}
              description={report.description}
              icon={report.icon}
              color={report.color}
              onClick={() => 
                report.id === 'custom' 
                  ? handleCustomReport()
                  : handleGenerateReport(report.id)
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Custom Report Dialog */}
      <Dialog
        open={customReportOpen}
        onClose={() => setCustomReportOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Custom Report Configuration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Metrics</InputLabel>
                <Select
                  multiple
                  value={customReportConfig.metrics}
                  onChange={(e) => setCustomReportConfig({
                    ...customReportConfig,
                    metrics: e.target.value
                  })}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="cases">Cases</MenuItem>
                  <MenuItem value="clients">Clients</MenuItem>
                  <MenuItem value="performance">Performance</MenuItem>
                  <MenuItem value="attendance">Attendance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={customReportConfig.format}
                  onChange={(e) => setCustomReportConfig({
                    ...customReportConfig,
                    format: e.target.value
                  })}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={customReportConfig.includeCharts}
                    onChange={(e) => setCustomReportConfig({
                      ...customReportConfig,
                      includeCharts: e.target.checked
                    })}
                  />
                }
                label="Include Charts"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomReportOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleGenerateReport('custom', customReportConfig);
              setCustomReportOpen(false);
            }}
          >
            Generate
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

export default ReportsList; 