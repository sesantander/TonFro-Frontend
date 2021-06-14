import React, { Component } from 'react';
// import ReactPaginate from 'react-paginate';
// import './journey.css'
import trip from '../../../services/trip';
import { Link } from 'react-router-dom';
import { Button, Icon, Select } from 'antd';
import { ToastContainer } from 'react-toastify';
import MTable from "../MTable";
import route from '../../../services/route';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';



class JourneyTrip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      list: [],
      total: 1,
      routes: [],
      startingPointId: '',
      endPointId: ''
    }
    this.heading = 'Booking';
    this.columns = [
      {
        title: 'MaxSeat',
        dataIndex: 'maxSeat',

       // sorter: (a, b) => a.age - b.age,
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),

      },
      
      {
        title: 'Current Booked',
        dataIndex: 'currentBooked',
        

      },
      {
        title: 'Date',
        dataIndex: 'date',
        

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

          (moment(record.createdAt, 'YYYY-MM-DD').format('YYYY-MM-DD')==moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'))?<Button size="small" type="primary" className="mrg-rt"><Link to={'/journey/bookings/edit/' + record.id}><Icon type="edit" /></Link></Button>:''
        ),
      },
    ];
  }
  componentDidMount() {
    this.getList();
    this.getRoutes();
  }
  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      startingPointId: value
    })
  }

  handledestinationChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      endPointId: value
    })
  }
  filter = () => {
    trip.filter({ startingPointId: this.state.source, endPointId: this.state.destination }).then(res => {
      console.log(res);
      let data = res.data;
      let list = data.data;
      this.setState({
        list: list,
        total: (data.data.length / 10),
        loading: false
      });
    })
  }
  getList = () => {
    trip.listbooking().then(res => {
      let data = res.data;
      let list = data.data;
      console.log(data)

      list.forEach(function (row) {
        row['key'] = row.id;
      })
      this.setState({
        list: list,
        total: (data.data.length / 10),
        loading: false
      });
    })
  }

  getRoutes = () => {
    route.list().then(res => {
      console.log(res)
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
  render() {
    const { Option } = Select;
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
              <Link className="btn btn-default pull-right" to="/journey/bookings/add" data-toggle="tooltip" title="Add Routes"><i className="fa fa-plus"></i> Add Bookings</Link>
            </div>

          </div>
        </section>
        <section className="content">
          <div className="row">
            {/* <div className="form-group col-md-3">
              <Select className="full-width" name="point_from" value={this.state.source} onChange={(e) => this.handleChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.routes.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div className="form-group col-md-3">
              <Select className="full-width" name="destination" value={this.state.destination} onChange={(e) => this.handledestinationChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.routes.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="col-md-3">
              <Button type="primary pull-left" onClick={this.filter}>Primary</Button>
            </div> */}
          </div>
          <div className="box">
            <div className="box-header with-border">
              <h3 className="box-title">{this.heading}</h3>
            </div>
            <div className="box-body">
              <MTable data={this.state.list} column={this.columns} />
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
      </>
    )
  }
}
export default JourneyTrip