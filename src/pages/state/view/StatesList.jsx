import React, { useEffect, useState } from 'react';
import { ENDPOINT } from '../../../endpoints/endpoints';
import { Button, message, Space, Spin, Table } from 'antd';
import { useNavigate } from 'react-router';

const StatesList = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const navigate = useNavigate();
  const [messageAPI, contextHolder] = message.useMessage();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      messageAPI.warning('Please Login!');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchStates(token, currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchStates = async (token, page = 1, limit = 10) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const url = `${ENDPOINT.STATES.LIST}?limit=${limit}&offset=${offset}&page=${page}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        messageAPI.error('Session Expired, Login again!');
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error('Network response was not OK');

      const data = await response.json();

      if (data && data.results && data.results.data) {
        setStates(data.results.data);
        setTotal(data.count);
      } else {
        setStates([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('States Fetch Error', error);
      messageAPI.error('Failed to fetch states');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state?')) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      messageAPI.warning('Please Login First');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(ENDPOINT.STATES.DELETE(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        messageAPI.error('Session Expired, Please Login Again');
        navigate('/login');
        return;
      }

      if (response.ok) {
        messageAPI.success('State deleted successfully');
        setStates((prev) => prev.filter((s) => s.id !== id));
        setTotal((prev) => prev - 1);
      } else {
        throw new Error('Failed to delete state');
      }
    } catch (error) {
      console.error('Delete State Error', error);
      messageAPI.error('State could not be deleted');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      messageAPI.warning('Please select at least one state to delete');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedRowKeys.length} state(s)?`)) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      messageAPI.warning('Please Login First');
      navigate('/login');
      return;
    }

    try {
      setBulkDeleting(true);
      const response = await fetch(ENDPOINT.STATES.BULK_DELETE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedRowKeys }),
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        messageAPI.error('Session Expired, Please Login Again');
        navigate('/login');
        return;
      }

      if (response.ok) {
        messageAPI.success(`${selectedRowKeys.length} state(s) deleted successfully`);
        setStates((prev) => prev.filter((s) => !selectedRowKeys.includes(s.id)));
        setTotal((prev) => prev - selectedRowKeys.length);
        setSelectedRowKeys([]);
      } else {
        throw new Error('Bulk delete failed');
      }
    } catch (error) {
      console.error('Bulk Delete Error', error);
      messageAPI.error('Failed to bulk delete states');
    } finally {
      setBulkDeleting(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'State Name (English)',
      dataIndex: 'name_en',
      key: 'name_en',
      sorter: (a, b) => (a.name_en || '').localeCompare(b.name_en || ''),
      render: (text, record) => (
        <a onClick={() => navigate(`/states/${record.id}`)}>{text || record.name}</a>
      ),
    },
    {
      title: 'State Name (Myanmar)',
      dataIndex: 'name_mm',
      key: 'name_mm',
      sorter: (a, b) => (a.name_mm || '').localeCompare(b.name_mm || ''),
      render: (text, record) => (
        <a onClick={() => navigate(`/states/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/states/${record.id}`)}>
            Detail
          </Button>
          <Button type="link" onClick={() => navigate(`/states/update/${record.id}`)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Loading States..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#d9f7ff', borderRadius: '8px' }}>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>States List</h2>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button danger loading={bulkDeleting} onClick={handleBulkDelete}>
              Delete Selected ({selectedRowKeys.length})
            </Button>
          )}
          <Button type="primary" onClick={() => navigate('/states/create')}>
            Create State
          </Button>
        </Space>
      </div>
      <Table
        dataSource={states}
        columns={columns}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} states.`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </div>
  );
};

export default StatesList;
