import React, { useEffect, useState } from 'react'
import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { useParams, useNavigate } from 'react-router';
import { Box, maxWidth, textTransform, width } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CategoriesDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  //mui Snack
  const [snackbar, setSnackbar] = useState({ open: false, message: "", security: 'info' });

  const showMessage = (message, security = 'info') => {
    setSnackbar({ open: true, message, security })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  useEffect(() => {
    //token check
    const token = localStorage.getItem('access_token');

    if (!token) {
      showMessage("Please Login", "warning")
      setTimeout(() => {
        navigate('/login')
      }, 1500)
      return;
    }
    fetchCategoriesDetail(token);
  }, [id])

const fetchCategoriesDetail = async (token) => {
    try {
        setLoading(true);

        const url = ENDPOINT.CATEGORIES.DETAIL(id);
        // const url = `${API_BASE_URL}/categories/${id}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {                              // fix 2: header → headers
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh-token');
            showMessage("Session Expired, Login again!", "error"); // fix 3: messageAPI.error → showMessage
            navigate('/login')
            return
        }

        if (!response.ok) {
            throw new Error('Network response was not OK')
        }

        const data = await response.json()
        console.log(data);
        setCategory(data)

    } catch (error) {
        console.error("Categories Fetch Error", error)
        showMessage("Categories Fetch Error", "error") // fix 4: message.error → showMessage

    } finally {
        setLoading(false);
    }
}

  const imageUrl = category?.logo && category.logo.startsWith('http')
  ? category.logo
  : `${IMAGE_BASE_URL}${category?.logo}`

  return (
    <Box>
      <Card sx={{ maxWidth: 700, boxShadow: '0 4px 20px black', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant='h6'>Categories Detail</Typography>
          <Button variant='contained' startIcon={<EditIcon />} sx={{ textTransform: 'none', borderRadius: '6px' }}>
            Edit
          </Button>
        </Box>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.serverity} variant='filled' sx={{width: '100%'}}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* fix: no .map() — display single object fields directly */}
        {loading ? (
          <Typography sx={{ p: 2 }}>Loading...</Typography>
        ) : category ? (
            <Box sx={{ p: 2 }}>

              {/* Avatar at top */}
              <Box sx={{ display: 'flex', justifyContent: 'start', mb: 2 }}>
                <Avatar
                  src={category.logo}
                  alt={category.name}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><b>ID</b></TableCell>
                      <TableCell>{category.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell>{category.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>Logo</b></TableCell>
                      <TableCell>
                        <Typography component='a' href={imageUrl} target='_blank'>{category?.logo}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              
            </Box>
          ) : (
          <Typography sx={{ p: 2 }}>No data found.</Typography>
        )}
      </Card>
    </Box>
  )
}

export default CategoriesDetail