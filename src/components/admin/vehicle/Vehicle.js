import React, { Component } from 'react';
import vehicle from '../../../services/vehicle';
import driver from '../../../services/driver';
// import ReactPaginate from 'react-paginate'; 
import { Link } from 'react-router-dom';
// import TableLoader from '../TableLoader';
import MTable from '../MTable';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import { Button, Icon, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import AssignVehicleModal from './AssignVehicleModal';
import { Radio } from 'antd';
class Vehicle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			list: [],
			driver: [],
			total: 1,
			loading: true,
			isAssigning: false,
			visible: false,
			vehicleId: '',
			driverId: '',
			vehicleInfo: {},
		};
		this.columns = [
			{
				title: '',
				dataIndex: 'id',
				render: (text, record) => (
          // <Radio name="vehicle" onChange={e => this.onRadioChangeChange(e, record)} value={record.id}></Radio>
          <input type="radio" name="vehicle" onChange={e => this.onRadioChangeChange(e, record)} value={record.id} />
				),
			},
			{
				title: 'Title',
				dataIndex: 'title',
				sorter: (a, b) => {
					return a.title.localeCompare(b.title);
        },
       
				//render: name => `${name.first} ${name.last}`,
				//...this.getColumnSearchProps('name'),
			},
			{
				title: 'Brand',
				dataIndex: 'brand',
				sorter: (a, b) => {
					return a.brand.localeCompare(b.brand);
				},
			},
			{
				title: 'Model',
				dataIndex: 'model',
				sorter: (a, b) => {
					return a.model.localeCompare(b.model);
				},
			},
			{
				title: 'Registration Number',
				dataIndex: 'vehicleNumber', 
				...this.getColumnSearchProps('vehicleNumber'),
			},
			{
				title: 'Engine Number',
				dataIndex: 'engineNumber',
			},
			{
				title: 'Driver',
				dataIndex: 'driver.user.name',
			},
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'isActive',
				render: (text, record) =>
					record.isActive ? (
						<span className="label label-success">Active</span>
					) : (
						<span className="label label-danger">Deactive</span>
					),
			},
			{
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<Link to={'/vehicle/edit/' + record.id}>
						<Button size="small" type="primary" className="mrg-rt">
							<Icon type="edit" />
						</Button>
					</Link>
				),
			},
			{
				title: 'Tracking',
				key: 'tracking',
				render: (text, record) => (
					<a href="http://www.dkglabs.com/" target="_blank">
						<Button size="small" type="primary" className="mrg-rt">
						Track
						</Button>
					</a>
				),
			},
		];
	}
	componentDidMount() {
		this.getList('');
		this.getDriverList();
	}
	componentDidCatch(error, info) {
		// Display fallback UI
		this.setState({ hasError: true });
		// You can also log the error to an error reporting service
		console.log(error, info);
	}
	onRadioChangeChange = (e, val) => {
		// console.log(val)
		this.setState({
			vehicleId: e.target.value,
			vehicleInfo: val,
		});
		console.log(this.state.vehicleId)
	};
	getList = v => {
		vehicle.list(v).then(res => {
			// console.log(res)
			let data = res.data;
			// console.log(data)

			let list = data.data;
			list.forEach(function(row) {
				row['key'] = row.id;
			});
			this.setState({
				list: data.data,
				total: data.data.length / 10,
				loading: false,
			});
		});
	};
	searchVehicle = e => {
		// console.log(e.target.value)
		this.getList(e.target.value);
	};
	getDriverList = () => {
		driver.list().then(res => {
			// console.log(res)
			let data = res.data;
			// console.log(data)

			let list = data.data;
			list.forEach(function(row) {
				row['key'] = row.id;
			});
			this.setState({
				driver: list,
			});
		});
	};
	assignModal = () => {
		if (this.state.vehicleId !== '') {
			this.setState({
				visible: true,
			});
		} else {
			notification.error('Please choose the vehicle first');
		}
	};
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};
	handleOk = () => {
		// console.log('test');
		const { vehicleId, driverId } = this.state;
		if (this.state.driverId !== '' && this.state.vehicleId !== '') {
			this.setState({
				isAssigning: true,
			});
			vehicle.assignDriver({ driverId: driverId, vehicleId: vehicleId }).then(res => {
				// console.log(res);
				notification.success('Driver assigned successfully');
				this.setState({
					visible: true,
					isAssigning: false,
				});
				this.getList();
			});
		} else {
			notification.error('Please choose vehicle and driver');
		}
	};
	chooseDriver = value => {
		console.log(`selected `);
		const id = value;
		this.setState({
			driverId: id,
		});
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
				<ToastContainer />

				<section className="content-header">
					<div className="bg-light lter b-b wrapper-md clearfix">
						<div className="pull-left">
							<h1>Vehicles</h1>
						</div>
						<div className="pull-right">
							<Link
								className="btn btn-default mrg-rt"
								to="/vehicle/add"
								data-toggle="tooltip"
								title="Add Vehicle"
							>
								<i className="fa fa-plus"></i> Add Vehicle
							</Link>
							<button className="btn btn-warning " onClick={this.assignModal}>
								+Assign
							</button>
						</div>
					</div>
				</section>
				<section className="content">
					<div className="box">
						<div className="box-header with-border">
							<div className="col-md-9">
								<h3 className="box-title">Vehicle</h3>
							</div>
							<div className="col-md-3">
							</div>
						</div>
						<div className="box-body table-responsive">
							<MTable data={this.state.list} column={this.columns} loading={this.state.loading} />
							{/*<table className="table table-striped">
                                 <tbody>
                                  <tr>
                                     <th></th>
                                     <th>Title</th>
                                     <th>Brand</th>
                                     <th>Model</th>
                                     <th>Registration Number</th>
                                     <th>Engine Number</th>
                                     <th>Driver</th>
                                     <th>Status</th>
                                     
                                     <th>Action</th>
                                  </tr>
                                
                             
                                  {
                                  this.state.list.map((val,index)=>{
                                  return (
                                  <tr key={val.id}>
                                     <td><Radio onChange={(e)=>this.onRadioChangeChange(e,val)}
                                                value={val.id}></Radio></td>
                                     <td>{val.title}</td>
                                     <td>{val.brand}</td>
                                     <td>{val.model}</td>
                                     <td>{val.vehicleNumber}</td>
                                     <td>{val.engineNumber}</td>
                                     <td>{val.enterprise_id}</td>
                                     <td>{
                                      (val.isActive)?<span className="label label-success">Active</span>:<span className="label label-danger">Deactive</span>
                                    }</td>
                                     <td>
                                     <Button size="small" type="primary" className="mrg-rt"><Link to={'/vehicle/edit/'+val.id} ><Icon type="edit" /></Link></Button>
                                      
                                     </td>
                                  </tr>
                                  )
                                  })   
                                  }        
                                  {
                                  this.state.loading?<TableLoader colspan="8" />:null
                                  }
                               </tbody>
                            </table>*/}
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

					<AssignVehicleModal
						visible={this.state.visible}
						driver={this.state.driver}
						vehicleId={this.state.vehicleId}
						handleCancel={this.handleCancel}
						handleOk={this.handleOk}
						chooseDriver={this.chooseDriver}
						loading={this.state.isAssigning}
						vehicleInfo={this.state.vehicleInfo}
					/>
				</section>
			</>
		);
	}
}
export default Vehicle;
