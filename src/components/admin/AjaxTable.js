import React, { Component } from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';

const columns = [
  {
    title: 'Title',
    dataIndex: 'name',
    sorter: true,
    //render: name => `${name.first} ${name.last}`,
    
  },
  {
    title: 'Latitude',
    dataIndex: 'lat',
    
  },
  {
    title: 'Longitude',
    dataIndex: 'long',
  }, {
    title: 'Status',
    dataIndex: 'isActive',
  }, 
  {
    title: 'Created',
    dataIndex: 'created_at',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
];

class AjaxTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'https://randomuser.me/api',
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.results,
        pagination,
      });
    });
  };

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.login.uuid}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default AjaxTable