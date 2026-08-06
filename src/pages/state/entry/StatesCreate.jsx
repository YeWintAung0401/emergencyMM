import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { ENDPOINT } from '../../../endpoints/endpoints';

const StatesCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name_en: '',
    name_mm: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please Login First', severity: 'warning' });
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

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
      const response = await fetch(ENDPOINT.STATES.CREATE, {
        method: 'POST',
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
          if (!d || typeof d !== 'object') return 'Failed to create state';
          if (d.message) return d.message;
          if (d.detail) return d.detail;
          const fieldErrors = Object.entries(d)
            .map(([field, errors]) => {
              const msgs = Array.isArray(errors) ? errors.join(', ') : String(errors);
              return `${field}: ${msgs}`;
            })
            .join(' | ');
          return fieldErrors || 'Failed to create state';
        };
        throw new Error(extractMessage(errData));
      }

      setSnackbar({ open: true, message: 'State created successfully!', severity: 'success' });
      setTimeout(() => navigate('/states/list'), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to create state.', severity: 'error' });
      console.error('Error creating state:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
            onClick={() => navigate('/states/list')}
            sx={{ textTransform: 'none', mr: 2 }}
          >
            Back
          </Button>
        </Box>

        <CardHeader
          title="Create State"
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
                startIcon={submitting ? null : <SaveIcon />}
                size="large"
                disabled={submitting}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
              >
                {submitting ? 'Creating...' : 'Create State'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatesCreate;
