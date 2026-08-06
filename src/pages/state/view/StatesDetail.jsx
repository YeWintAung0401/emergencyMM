import React, { useEffect, useState } from 'react';
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
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { ENDPOINT } from '../../../endpoints/endpoints';

const StatesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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
      setState(stateData);
    } catch (error) {
      console.error('Fetch state error:', error);
      setSnackbar({ open: true, message: 'Failed to load state data.', severity: 'error' });
    } finally {
      setLoading(false);
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
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/states/list')}
            sx={{ textTransform: 'none' }}
          >
            Back to List
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/states/update/${id}`)}
            sx={{ textTransform: 'none', borderRadius: '6px' }}
          >
            Edit State
          </Button>
        </Box>

        <CardHeader
          title="State Detail"
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          sx={{ pt: 0 }}
        />

        <CardContent>
          {state ? (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                  <strong>ID</strong>
                </Typography>
                <Typography variant="body1">{state.id}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                  <strong>Name (English)</strong>
                </Typography>
                <Typography variant="body1">{state.name_en || state.name || '—'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                  <strong>Name (Myanmar)</strong>
                </Typography>
                <Typography variant="body1">{state.name_mm || '—'}</Typography>
              </Box>

              {state.townships && state.townships.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Townships</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {state.townships.map((t, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          background: '#e3f2fd',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                        }}
                      >
                        {typeof t === 'object' ? t.name || t.name_en : t}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          ) : (
            <Typography>No data found.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatesDetail;