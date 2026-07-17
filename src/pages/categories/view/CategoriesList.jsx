//rafce
import React, { useEffect, useState } from 'react'
import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { Avatar, Button, message, Space, Spin, Table } from 'antd'

import { flex, width } from '@mui/system'
import { useNavigate } from 'react-router'
import { size } from 'lodash-es'


const CategoriesList = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    //message hook
    const [messageAPI, contextHolder] = message.useMessage();


    useEffect(() => {
        //Token Check 
        const token = localStorage.getItem('access_token');

        if (!token) {
            messageAPI.warning("Please Login!");
            setTimeout(() => {
                navigate('/login')
            }, 1500);
            return;
        }
        fetchCategories(token, currentPage, pageSize)
    }, [currentPage, pageSize])

    const fetchCategories = async (token, page = 1, limit = 10) => {
        try {
            setLoading(true);

            const offset = (page - 1) * limit;
            const url = `${ENDPOINT.CATEGORIES.LIST}?limit=${limit}&offset=${offset}&page=${page}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            //Token EXPIRE
            if (response.status == 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                messageAPI.error("Session Expired, Login again!");
                navigate('/login')
                return
            }

            if (!response.ok) {
                throw new Error('Network response was not OK')
            }

            const data = await response.json()

            if (data && data.results && data.results.data) {
                setCategories(data.results.data)
                setTotal(data.count)
            } else {
                setCategories([])
                setTotal(0)
            }

        } catch (error) {
            console.error("Categories Fetch Error", error)
            messageAPI.error("Categories Fetch Error")
        } finally {
            setLoading(false);
        }
    };

    const handleDetail = (record) => {
        console.log("Detail", record);
        navigate(`/categories/${record.id}`);
    }

    const handleEdit = (record) => {
        console.log("Edit", record);
        navigate(`/categories/update/${record.id}`);
    }

    // DELETE
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            messageAPI.warning("Please Login First");
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const url = ENDPOINT.CATEGORIES.DELETE(id);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            //token exp
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                messageAPI.error("Session Exp, Please Login Again")
                navigate('/login')
                return
            }

            if (response.ok) {
                messageAPI.success("Category deleted successfully");
                setCategories(preCategories => preCategories.filter(category => category.id !== id));
            } else {
                throw new Error("Failed to delete category");
            }

        } catch (error) {
            console.error("Error Fetch Categories", error);
            messageAPI.error("Category could not be deleted")
        } finally {
            setLoading(false);
        }
    }

    //Design Table Columns 

    const colums = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (text) => {
                const imageurl = text && text.startsWith('http') ? text : `${IMAGE_BASE_URL}${text}`;
                return <Avatar src={imageurl} shape='square' size={70} alt='logo' />
            },
            width: 100,
        },
        {
            title: 'Category Name English',
            dataIndex: 'name_en',
            key: 'name_en',
            sorter: (a, b) => a.name_en.localeCompare(b.name_en),
            render: (text, record) => (
                <a onClick={() => navigate(`/categories/${record.id}`)}>
                    {text}
                </a>
            )
        },
        {
            title: 'Category Name Myanmar',
            dataIndex: 'name_mm',
            key: 'name_mm',
            sorter: (a, b) => a.name_mm.localeCompare(b.name_mm),
            render: (text, record) => (
                <a onClick={() => navigate(`/categories/${record.id}`)}>
                    {text}
                </a>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 300,
            render: (_, record) => (
                <Space size="middle" >
                    <Button type='link' onClick={() => handleDetail(record)}>Detail</Button>
                    <Button type='link' onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type='link' danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            )
        }
    ]

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size='large' tip="Loading Categories..." />
            </div>
        )
    }

    return (
        <div style={{ padding: '24px', background: '#dcffd9', borderRadius: '8px' }}>
            {/* message */}
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>Categories List</h2>
                <Button type="primary" onClick={() => navigate('/categories/create')}>
                    Create Category
                </Button>
            </div>
            <Table
                dataSource={categories}
                columns={colums}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} categories. `,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size)
                    }
                }}
            />
        </div>
    )
}

export default CategoriesList