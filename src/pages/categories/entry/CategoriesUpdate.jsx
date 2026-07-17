import React, { useState, useEffect } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints';

const CategoriesUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name_en: '',
    name_mm: '',
    logo: null, // null = keep existing; File object = new upload
  });

  const [existingLogoUrl, setExistingLogoUrl] = useState(null);
  const [preview, setPreview] = useState(null); // preview URL for newly selected file
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ─── Auth guard + fetch existing category data ────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please Login First', severity: 'warning' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchCategory(token);
  }, [id]);

  const fetchCategory = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINT.CATEGORIES.DETAIL(id), {
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

      if (!response.ok) throw new Error('Failed to fetch category');

      const data = await response.json();
      const category = data?.data ?? data;

      setForm({ name_en: category.name_en ?? '', name_mm: category.name_mm ?? '', logo: null });

      // Resolve logo URL (handle relative paths from API)
      if (category.logo) {
        const resolved = category.logo.startsWith('http')
          ? category.logo
          : `${IMAGE_BASE_URL}${category.logo}`;
        setExistingLogoUrl(resolved);
      }
    } catch (error) {
      console.error('Fetch category error:', error);
      setSnackbar({ open: true, message: 'Failed to load category data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Form handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSnackbar({ open: true, message: 'Authentication required.', severity: 'error' });
      return;
    }

    const data = new FormData();
    data.append('name_en', form.name_en);
    data.append('name_mm', form.name_mm);
    if (form.logo) {
      data.append('logo', form.logo);
    }

    try {
      setSubmitting(true);
      const response = await fetch(ENDPOINT.CATEGORIES.UPDATE(id), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type manually — browser adds the multipart boundary automatically
        },
        body: data,
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
          if (!d || typeof d !== 'object') return 'Failed to update category';
          if (d.message) return d.message;
          if (d.detail) return d.detail;
          const fieldErrors = Object.entries(d)
            .map(([field, errors]) => {
              const msgs = Array.isArray(errors) ? errors.join(', ') : String(errors);
              return `${field}: ${msgs}`;
            })
            .join(' | ');
          return fieldErrors || 'Failed to update category';
        };

        throw new Error(extractMessage(errData));
      }

      setSnackbar({ open: true, message: 'Category updated successfully!', severity: 'success' });
      setTimeout(() => navigate('/categories/list'), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update category.',
        severity: 'error',
      });
      console.error('Error updating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Avatar display: prefer new preview, then existing URL ───────────────────
  const avatarSrc = preview ?? existingLogoUrl;

  // ─── Loading state ────────────────────────────────────────────────────────────
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
        {/* Back button */}
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
          title="Update Category"
          titleTypographyProps={{ variant: 'h5', align: 'center', fontWeight: 'bold' }}
        />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="English Name"
                name="name_en"
                value={form.name_en}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Myanmar Name"
                name="name_mm"
                value={form.name_mm}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Logo preview & upload */}
              <Box textAlign="center">
                <Avatar
                  src={avatarSrc}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '2px dashed #ccc',
                  }}
                />

                {form.logo && (
                  <Typography variant="caption" display="block" mb={1} color="text.secondary">
                    New file: {form.logo.name}
                  </Typography>
                )}

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {form.logo ? 'Change Logo' : 'Upload New Logo'}
                  <input hidden type="file" accept="image/*" onChange={handleImage} />
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />
                }
                size="large"
                disabled={submitting}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
              >
                {submitting ? 'Saving…' : 'Update Category'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoriesUpdate;