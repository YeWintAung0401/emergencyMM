//rafce
import React, { useEffect, useState } from 'react';
import { API_BASE_URL, ENDPOINT } from '../../../endpoints/endpoints';

import { Spin, Table, message } from 'antd'
import { useNavigate } from 'react-router';

const StatesList = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
//message 
  const [ messageAPI, contextHolder ] = message.useMessage();

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if(!token) {
      messageAPI.warning('Please Login')
      setTimeout(() => {
        navigate('/login')
      }, 2000);
      return;
    }

    FetchStates();
  }, []);

  const FetchStates = async (token) => {
    try {
      setLoading(true)

      const url = ENDPOINT.STATES.LIST.replace('{API_BASE_URL', API_BASE_URL)
      // const response = await fetch(url)
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
        throw new Error('Network Error')
      }

      const data = await response.json()

      setStates(data)

    } catch (error) {
      console.error("States Fetch Error", error)
      message.error("States Fetch Error")


    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: 'State Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name) 
    },
    {
      title: 'Township Name',
      dataIndex: 'townships',
      key: 'townships',
    }
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size='large' description="Loading Categories" />
      </div>
    )
  }


  return (
    <div style={{ padding: '24px', background: '#d9ffdf', borderRadius: '8px' }}>
      <h2> States List </h2>
      <Table
        dataSource={states}
        columns={columns}
        rowKey="id" />
    </div>
  )
}

export default StatesList;
