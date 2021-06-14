import React, { Component } from 'react';
import './ponits.css';
import point from '../../../services/point';
import { Link } from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
// import TableLoader from '../TableLoader';
import MTable from './MTable';
import { Button, Icon, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
class Point extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
    };
    this.heading = 'Point';
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'name',
        sorter: (a, b) => {
          return a.name.localeCompare(b.name);
        },
        ...this.getColumnSearchProps('name'),
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),
      },
      {
        title: 'Latitude',
        dataIndex: 'lat',
      },
      {
        title: 'Longitude',
        dataIndex: 'long',
      },
      {
        title: 'Status',

        key: 'isActive',
        render: (text, record) =>
          record.isActive ? (
            <span className="label label-success">Active</span>
          ) : (
              <span className="label label-danger">Deactive</span>
            ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <>
            <Button size="small" type="primary" className="mrg-rt">
              <Link to={'/point/edit/' + record.id}>
                <Icon type="edit" />
              </Link>
            </Button>
          </>
        ),
      },
    ];
  }

  // componentWillMount(){}
  componentDidMount() {
    this.getList();
  }
  getList = () => {
    point.list().then(res => {
      console.log(res);
      let data = res.data;
      let list = data.data;
      list.forEach(function (row) {
        row['key'] = row.id;
        // row['pickupTime'] = moment(moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a');
        // row['dropTime'] = moment(moment(row.dropTime, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a');
        row['createdAt'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a');
        
      });
      this.setState({
        list: list,
        total: data.data.length / 10,
        loading: false,
      });
    });
  };
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}
  searchValue = e => {
    console.log(e.target.value);
    this.getList(e.target.value);
  };


  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
				</Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
				</Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(dataIndex);
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
				</Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
				</Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  
  render() {
    return (
      <>
        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/point/add"
                data-toggle="tooltip"
                title="Add Customer"
              >
                <Icon type="edit" /> Add Point
							</Link>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="box">
            <div className="box-header with-border">
              <div className="col-md-9">
                <h3 className="box-title">{this.heading}</h3>
              </div>
              {/* <div className="col-md-3"><input type="text" className="form-control" onChange={(e) => this.searchValue(e)} /></div> */}
            </div>
            <div className="box-body table-responsive">
              {/*<Table columns={this.state.column} dataSource={this.state.data} >
                               
                            </ Table>*/}
              <MTable data={this.state.list} column={this.columns} />
            </div>
            {/*<div className="box-footer clearfix">
                       <ReactPaginate 
                            pageCount={this.state.total}
                            pageRangeDisplayed={1}
                            marginPagesDisplayed={2}
                            previousLabel="«"
                            activeClassName="active"
                            onPageChange={this.handlePageClick}
                            containerClassName="pagination pagination-sm no-margin pull-right"
                            ></ReactPaginate >
                      </div>*/}
          </div>
        </section>
      </>
    );
  }
}

export default Point;
