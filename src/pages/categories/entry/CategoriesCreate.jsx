import React, { useState, useEffect } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { ENDPOINT } from "../../../endpoints/endpoints";

const CategoriesCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name_en: "",
        name_mm: "",
        logo: null,
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setSnackbar({ open: true, message: "Please Login First", severity: "warning" });
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    }, [navigate]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prevForm) => ({ ...prevForm, logo: file }));
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        if (!token) {
            setSnackbar({ open: true, message: "Authentication required.", severity: "error" });
            return;
        }

        const data = new FormData();
        data.append("name_en", form.name_en);
        data.append("name_mm", form.name_mm);
        if (form.logo) {
            data.append("logo", form.logo);
        }

        try {
            const response = await fetch(ENDPOINT.CATEGORIES.CREATE, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            console.log("Create Category Response:", response);

            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setSnackbar({ open: true, message: "Session Expired. Login again!", severity: "error" });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to create category");
            }

            setSnackbar({ open: true, message: "Category created successfully!", severity: "success" });
            setTimeout(() => {
                navigate('/categories/list');
            }, 1500);
        } catch (error) {
            setSnackbar({ open: true, message: error.message || "Failed to create category.", severity: "error" });
            console.error("Error creating category:", error);
        }
    }

    return (
        <Box display="flex" justifyContent="center" mt={5}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Card sx={{ width: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/categories/list')}
                        sx={{ textTransform: 'none', mr: 2 }}
                    >
                        Back
                    </Button>
                </Box>
                <CardHeader
                    title="Create Category"
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

                            <Box textAlign="center">
                                <Avatar
                                    src={preview}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: "auto",
                                        mb: 2,
                                        border: '2px dashed #ccc'
                                    }}
                                />

                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Upload Logo
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                    />
                                </Button>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="large"
                                sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Create Category
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default CategoriesCreate;
