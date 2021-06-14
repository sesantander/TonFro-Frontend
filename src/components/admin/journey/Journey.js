import React, { Component } from 'react';
// import ReactPaginate from 'react-paginate';
import './journey.css'
import trip from '../../../services/trip';
import { Link } from 'react-router-dom';
import { Button, Icon, Select, Modal, Spin, Input, DatePicker } from 'antd';
import notification from '../../../services/notification';
import point from '../../../services/point';
import { ToastContainer } from 'react-toastify';
import MTable from "../MTable";
import route from '../../../services/route';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Highlighter from 'react-highlight-words';

class Journey extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      list: [],
      total: 1,
      routes: [],
      points: [],
      startingPointId: '',
      endPointId: '',
      visible: {
        seat: false,
        price: false
      },
      prices: {
        from: '',
        to: '',
        price: 0,
        date:null
      },
      tripId: '',
      tripPrice: [],
      tripPoints: [],
      trip: [],
      tripSeat: [],
      seat: 0,
      seatloading: false,
      priceloading: false,
      seatupdatedate: null,
      loading:true,
      datee:null
    }
    const format = 'MM/DD/YYYY';
    this.heading = 'Journey';
    this.seatColumn = [{
        title: 'MaxSeat',
        dataIndex: 'maxSeat'
       },
       {
        title: 'Date',
        dataIndex: 'date',
        ...this.getColumnSearchProps('date')
       },
         {
          title: 'CurrentBooked',
          dataIndex: 'currentBooked'
        },
       {
        title: 'Status',
        dataIndex: 'isActive',
         render: (text, record) => (
          (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        ),
       }
      ];
    this.priceColumn = [{
        title: 'Price',
        dataIndex: 'price',
        ...this.getColumnSearchProps('price')
       },
       {
        title: 'Date',
        dataIndex: 'date',
         ...this.getColumnSearchProps('date')
       },
       {
        title: 'From',
        dataIndex: 'from',
        ...this.getColumnSearchProps('from')
       },
       {
        title: 'To',
        dataIndex: 'to',
        ...this.getColumnSearchProps('to')
       }
      ]; 
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'name',
        sorter: (a, b) => {
          a.name = a.name != null ? a.name : "";
          b.name = b.name != null ? b.name : "";
         return a.name.localeCompare(b.name) 
       }
      }, {
        title: 'MaxSeat',
        dataIndex: 'maxSeat' 

      },
      {
        title: 'StartTime',
        dataIndex: 'startTime'

      },
      {
        title: 'CurrentBooked',
        dataIndex: 'params'

      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        render: (text, record) => (
          (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        ),
      },

      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <><Button size="small" type="primary" className="mrg-rt"><Link to={'/journey/edit/' + record.id}><Icon type="edit" /></Link></Button>
            <Button size="small" type="primary" className="mrg-rt" onClick={() => this.showseatsModel(record.id, record.maxSeat)}>Seat</Button>
            <Button size="small" type="primary" className="mrg-rt" onClick={() => this.showPricessModel(record.id)}>Price</Button>

          </>
        ),
      },
    ];
  }
  componentDidMount() {
    this.getList();
    this.getRoutes();
    this.getPoints();
  }
  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      startingPointId: value
    })
  }
    getRoutePoints(params) {
    trip.getPoint(params).then(res => {
      console.log(res)
      let data = res.data;
      if(data.status){
      let list = data.data;
      // console.log(list)
        list.forEach(function (row) {
          row['key'] = row.pointId;
        })
        this.setState({
          tripPoints : list,
        });
        // console.log(this.state.tripPoints)
        this.getTripAllPrice(params) 
      }
    });
  }
  getPoints() {
    point.list().then(res => {
      console.log(res)
      let data = res.data;
      if(data.status){
      let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
      if (list) {
        this.setState({
          'points': list,

        });
      }
    }
    });
  }
  handledestinationChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      endPointId: value
    })
  }
  filter = () => {
    trip.filter({ startingPointId: this.state.startingPointId, endPointId: this.state.endPointId }).then(res => {
      console.log(res);
      let data = res.data;
      let list = data.data; 
      console.log(list);
      if(data.status){ 
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          list: list,
          total: (data.data.length / 10),
          loading: false
        });
      }
    })
  }
  getList = () => {
    trip.list().then(res => {
      let data = res.data;
       this.setState({
        loading: false
      });
      if(data.status){
      let list = data.data;
      console.log(data)
      list.forEach(function (row) {
        row['key'] = row.id;
      })
      this.setState({
        list: list,
        total: (data.data.length / 10),
         
      });
    }
    })
  }

  showseatsModel(tripid, maxseat) {
    let visible = this.state.visible;
    visible['seat'] = true;
    this.setState({
      visible: visible,
      seat: 0,
      tripId: tripid,
      datee:null
    })
    console.log(this.state.seat)
    this.getTripsBookingSeat(tripid) 
  }
  getTripsBookingSeat(id){
      console.log(id)
      trip.getTripsBooking(id).then(res=>{

          const {data} = res

          if(data.status){

              let letsData = data.data
              letsData.forEach(function (row) {
                  row['key'] = row.id;
                  row['date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
              })
              this.setState({
                  tripSeat:letsData
              })
          }
      })
  }
  showPricessModel(tripid) {
    let visible = this.state.visible;
    let prices = this.state.prices;
    visible['price'] = true;
    prices = {
        from: '',
        to: '',
        price: 0,
        date:''
      }
    this.setState({
      visible: visible,
      //seat:maxseat,
      tripId: tripid,
      prices: prices,
      tripPrice:[],
      tripPoints:[],
      datee:null
    }) 
   
    this.getRoutePoints(tripid)

  }
  handleCancel = (type) => {
    let visible = this.state.visible;
    visible[type] = false;
    let prices = this.state.prices;
    prices['price'] = 0;
    this.setState({
      visible: visible,
      prices: prices
    })
  }
  handleOk = (type) => {
    let visible = this.state.visible;
    console.log('test');
    const { vehicleId, driverId } = this.state;
    if (type === 'seat') {
      this.setState({
        seatloading: true,
      })
      this.manageSeat();
    } if (type === 'price') {
     if(window.confirm('Are you sure want to add price')){
      this.managePrice();
      }
    } 
  }
  handleOpenChange = open => {
    console.log(open)
    var formatted = moment(open, 'MM/DD/YYYY').format('MM/DD/YYYY');
    console.log(formatted)
    this.setState({
      seatupdatedate: formatted,
      datee:open

    })

  };
  handlePriceDateChange = open => {
    console.log(open)
    var formatted = moment(open, 'MM/DD/YYYY').format('MM/DD/YYYY');
    console.log(formatted);
    let prices = this.state.prices;
    prices.date = formatted;
    this.setState({
      prices:prices,
      datee:open
    });
     
  };
  handlePriceFromChange = (value) => {
    console.log(value);
    let prices = this.state.prices;
    prices.from = value;
    this.setState({
      prices:prices
    });

  }
  handlePriceToChange = (value) => {
    console.log(value);
    let prices = this.state.prices;
    prices.to = value;
    this.setState({
      prices:prices
    });

  }
  onPriceDateChange = (date, dateString) => {
    console.log(date);
    console.log(dateString)
    let prices = this.state.prices;
    prices.from = dateString[0];
    prices.to = dateString[1];
    this.setState({
      prices:prices
    });

  }
  manageSeat() {
    let visible = this.state.visible;
    if (this.state.seat > 0 && this.state.seat != '') {
      trip.addseat({ "tripId": this.state.tripId, "maxSeat": this.state.seat, 'date': this.state.seatupdatedate }).then(res => {
        console.log(res);
        const {data} = res
        if(data.status){
        notification.success('Record added successfully');
        this.getList();
        visible['seat'] = false;
        this.setState({
          seatloading: false,
          visible: visible
        })
      }else{
        
        notification.error(data.statusMessage);
        this.setState({
          seatloading: false,
           
        })
      }
      });
    } else {
      notification.error('Seat should be greater than 0');
    }
  }
  managePrice() {
    let visible = this.state.visible;
    let prices = this.state.prices
    if (this.state.prices.price > 0 && this.state.prices.price != '') {
      trip.addprice({ "tripId": this.state.tripId, "prices": [this.state.prices] }).then(res => {
        console.log(res);
        const {data} = res
        if(data.status){
        notification.success('Record added successfully');
        this.getList();
        visible['price'] = false;
        prices = {
        from: '',
        to: '',
        price: 0,
      }
        this.setState({
          priceloading: false,
          visible: visible,
          prices:prices
        })
}else{ 
      notification.error('Api Error');
}
      });  
    } else {
      notification.error('Price should be greater than 0');
    }
  }
  chooseMaxSeat(value) {
    this.setState({
      seat: value.target.value
    })
  }
  getRoutes = () => {
    route.list().then(res => {
     // console.log(res)
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          routes: list,

        });
      }
    })
  }
  getTripAllPrice = (id) => {
    trip.getBookingAllPrice(id).then(res => {
      let response = res.data;
      if(response.status){
        const {data} = response
         data.forEach(function (row) {
          row['key'] = row.id;
        }) 
        for(let row of data){
           row['key'] = row.id;
           row['from'] = '';
           row['to'] = '';
          for(let value of this.state.tripPoints){
            if(value.pointId==row.fromId){
              row['from'] = value.point.name
            } 
            if(value.pointId==row.toId){
              row['to'] = value.point.name
            }
          }
        }
        console.log(this.state.tripPoints)
        console.log(data)
        this.setState({
          tripPrice:data
        })
      }
    })
  }
  handlePriveValue=(e)=>{
     let prices = this.state.prices;
     prices.price = e.target.value;
     this.setState({
       prices:prices
     });
  }
  


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
  render() {
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
              <Link className="btn btn-default pull-right" to="/journey/add" data-toggle="tooltip" title="Add Routes"><i className="fa fa-plus"></i> Add Journey</Link>
            </div>
            <Link className="btn btn-default pull-right" to="/journey/booking" data-toggle="tooltip" title="Add Routes"><i className="fa fa-plus"></i> Booking</Link>
          </div>
        </section>
        <section className="content">
          <div className="row">
            <div className="form-group col-md-3">
              <Select className="full-width" name="point_from" value={this.state.startingPointId} onChange={(e) => this.handleChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.points.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div className="form-group col-md-3">
              <Select className="full-width" name="destination" value={this.state.endPointId} onChange={(e) => this.handledestinationChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.points.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="col-md-3">
              <Button type="primary pull-left" onClick={this.filter}>Search</Button>
            </div>
          </div>
          <div className="box">
            <div className="box-header with-border">
              <h3 className="box-title">{this.heading}</h3>
            </div>
            <div className="box-body table-responsive">
              <MTable data={this.state.list} column={this.columns} loading={this.state.loading} />
              {/* <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>MaxSeat</th>
                    <th>StartTime</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                  {
                    this.state.list.map(val => {
                      return (
                        <tr key={val.id}>
                          <td>{val.maxSeat}</td>
                          <td>{val.startTime}</td>
                          <td> {
                            (val.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
                          }</td>
                          <td>
                            <Button size="small" type="primary" className="mrg-rt"><Link to={'/journey/edit/' + val.id}><Icon type="edit" /></Link></Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table> */}
            </div>
            {/* <div className="box-footer clearfix">
              <ReactPaginate
                pageCount={this.state.total}
                pageRangeDisplayed={1}
                marginPagesDisplayed={2}
                previousLabel="«"
                activeClassName="active"
                onPageChange={this.handlePageClick}
                containerClassName="pagination pagination-sm no-margin pull-right"
              ></ReactPaginate >
            </div> */}
          </div>


        </section>
        <Modal
          title={'Manage Seat'}
          visible={this.state.visible.seat}
          onOk={() => this.handleOk('seat')}
          onCancel={() => this.handleCancel('seat')}>
            <Spin spinning={this.state.seatloading}>
            <div className="row mb-2">
              <Input
                style={{ width: '100%' }}
                placeholder="Enter the seat"
                onChange={(e) => this.chooseMaxSeat(e)}
                value={this.state.seat}
              />
            </div>
            <div className="row">
              <DatePicker format={this.format} value={this.state.datee} onChange={this.handleOpenChange} />
            </div>
            <div className="row">
              <MTable data={this.state.tripSeat} pagination="5" column={this.seatColumn} loading={this.state.loading} />
            </div>
          </Spin>
        </Modal>

        <Modal
          title={'Manage Price'}
          visible={this.state.visible.price}
          onOk={() => this.handleOk('price')}
          onCancel={() => this.handleCancel('price')}> 
           <Spin spinning={this.state.priceloading}>
            <div className="row mb-2">
             <div className="form-group col-md-6">
              <Input
                style={{ width: '100%' }}
                placeholder="Enter the Price"
                onChange={(e) => this.handlePriveValue(e)}
                value={this.state.prices.price}
              />
            </div>
            
           <div className="form-group col-md-6">
            <DatePicker format={this.format} value={this.state.datee} onChange={this.handlePriceDateChange} />
              {/* <RangePicker format={this.format} className="full-width" onChange={this.onPriceDateChange} /> */}
            </div>
            </div>
            <div className="row">
            <div className="form-group col-md-6">
              <Select className="full-width" name="point_from" placeholder="From" value={this.state.prices.from} onChange={(e) => this.handlePriceFromChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                  <Option value="">From</Option>

                {
                  this.state.tripPoints.map(val => {
                    return (
                       <Option key={val.pointId} value={val.pointId}>{val.point.name}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div className="form-group col-md-6">
              <Select className="full-width" name="destination" placeholder="" value={this.state.prices.to} onChange={(e) => this.handlePriceToChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                  <Option value="">To</Option>
                {
                  this.state.tripPoints.map(val => {
                    return (
                      <Option key={val.pointId} value={val.pointId}>{val.point.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            </div>
            <div className="row">
              <MTable data={this.state.tripPrice} pagination="15" column={this.priceColumn} loading={this.state.loading} />
            </div>
          </Spin>
        </Modal>
      </>
    )
  }
}
export default Journey