//rafce
import React, { useEffect, useState } from 'react'
import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { Avatar, message, Space, Spin, Table } from 'antd'

import {flex, width } from '@mui/system'
import { useNavigate } from 'react-router'
import { Button } from 'antd/es/radio'


const CategoriesList = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    //message hook
    const [ messageAPI, contextHolder ] = message.useMessage();


    useEffect(() => {
        //Token Check 
        const token = localStorage.getItem('access_token');

        if(!token) {
            messageAPI.warning("Please Login!");
            setTimeout(() => {
                navigate('/login')
            }, 1500);
            return;
        }
        fetchCategories()
    }, [])

    const fetchCategories = async (token) => {
        try {
            setLoading(true);

            const url = ENDPOINT.CATEGORIES.LIST.replace('{API_BASE_URL}', API_BASE_URL)

            // const response = await fetch(url)
            // if (!response.ok) { //ok==200
            //     throw new Error('Network Error')
            // }

            const response = await fetch(url, {
                method: 'GET',
                header: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            })

            //Token EXPIRE
            if( response.status == 401 ) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh-token');
                messageAPI.error("Session Expired, Login again!");
                navigate('/login')
                return
            }

            if (!response.ok) {
                throw new Error('Network response was not OK')
            }

            const data = await response.json()
            setCategories(data)

        } catch (error) {
            console.error("Categories Fetch Error", error)
            message.error("Categories Fetch Error")


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
        navigate('/categories/update/${record.id}');
    }

    const handleDelete = (record) => {
        console.log("Delete", record);
        navigate('/categories/delete/${record.id}');
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
            title: 'Category Name', 
            dataIndex: 'name', 
            key: 'name', 
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'50vh'}}>
                <Spin size='large' description="Loading Categories" />
            </div>

        )
    }
    return (
        <div style={{ padding: '24px', background: '#dcffd9', borderRadius: '8px'}}>
        {/* message */}
        {contextHolder}
            <h2> CategoriesList </h2>
            <Table
                dataSource={categories}
                columns={colums}
                rowKey="id" />
        </div>
    )

}

export default CategoriesList