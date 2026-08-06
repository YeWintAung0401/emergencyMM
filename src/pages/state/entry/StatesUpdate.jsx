import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { ENDPOINT } from '../../../endpoints/endpoints';

const StatesUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name_en: '',
    name_mm: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please Login First', severity: 'warning' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchState(token);
  }, [id]);

  const fetchState = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINT.STATES.DETAIL(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setSnackbar({ open: true, message: 'Session Expired. Login again!', severity: 'error' });
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch state');

      const data = await response.json();
      const stateData = data?.data ?? data;

      setForm({
        name_en: stateData.name_en ?? stateData.name ?? '',
        name_mm: stateData.name_mm ?? '',
      });
    } catch (error) {
      console.error('Fetch state error:', error);
      setSnackbar({ open: true, message: 'Failed to load state data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSnackbar({ open: true, message: 'Authentication required.', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(ENDPOINT.STATES.UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name_en: form.name_en, name_mm: form.name_mm }),
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setSnackbar({ open: true, message: 'Session Expired. Login again!', severity: 'error' });
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const extractMessage = (d) => {
          if (!d || typeof d !== 'object') return 'Failed to update state';
          if (d.message) return d.message;
          if (d.detail) return d.detail;
          const fieldErrors = Object.entries(d)
            .map(([field, errors]) => {
              const msgs = Array.isArray(errors) ? errors.join(', ') : String(errors);
              return `${field}: ${msgs}`;
            })
            .join(' | ');
          return fieldErrors || 'Failed to update state';
        };
        throw new Error(extractMessage(errData));
      }

      setSnackbar({ open: true, message: 'State updated successfully!', severity: 'success' });
      setTimeout(() => navigate('/states/list'), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to update state.', severity: 'error' });
      console.error('Error updating state:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ width: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: 'none', mr: 2 }}
          >
            Back
          </Button>
        </Box>

        <CardHeader
          title="Update State"
          titleTypographyProps={{ variant: 'h5', align: 'center', fontWeight: 'bold' }}
        />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="State Name (English)"
                name="name_en"
                value={form.name_en}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="State Name (Myanmar)"
                name="name_mm"
                value={form.name_mm}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                size="large"
                disabled={submitting}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
              >
                {submitting ? 'Saving…' : 'Update State'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatesUpdate;
