import React, { Component } from 'react';
import user from '../../services/user';
import MTable from './MTable';
import { Button, Icon, Select, Modal, Spin, Input } from 'antd';
import { Link } from 'react-router-dom';
import dashboard from '../../services/dashboard';
// import { Chart } from 'react-charts'
import { Line } from 'react-chartjs-2';
import { ToastContainer } from 'react-toastify';

// import { Chart } from "react-google-charts";
import moment from 'moment';
import notification from '../../services/notification';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      source: '',
      destination: '',
      feedback: [],
      customer_list: [],
      notification: [],
      dashboard: {},
      todaybookingTotal: {},
      todaybookingData: [],
      totalTodayBooking: '',
      customer_modal: false,
      usermessage: '',
      userIds: [],
      recentbookinglist: [],
      isTodayBooking: true,
      isRecentBooking: true,
      isNotification: false,
      graphlabel: [],
      graphdata: [],
      sidebookingData: [],
      color: ['#00c0ef', '#dd4b39', '#00a65a', '#f39c12', '#337ab7'],
      loading:false
    };
    this.columns = [
      {
        title: 'Journey name',
        dataIndex: 'trip.name'
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),
      },
      {
        title: 'Start Time',
        dataIndex: 'trip.startTime',
      },
      {
        title: 'Vehicle Number',
        dataIndex: 'trip.vehicle.vehicleNumber',
      },
      {
        title: 'Total Seat',
        dataIndex: 'maxSeat',
      },

      {
        title: 'Booked Seat',
        dataIndex: 'currentBooked',
      },

      {
        title: 'Detail',
        key: 'action',
        render: (text, record) => (
          <><Button size="small" type="primary" className="mrg-rt"><Link to={'/booking/' + record.tripId}>Detail</Link></Button>


          </>
        ),
      },
    ];
    this.recentbookingcolumn = [
      {
        title: 'Name',
        dataIndex: 'nameBookedFor',

        sorter: (a, b) => {
          return a.nameBookedFor.localeCompare(b.nameBookedFor);
        },
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),
      },
      {
        title: 'Mobile',
        dataIndex: 'mobileBookedFor',
      },
      {
        title: 'Price',
        dataIndex: 'price',
      },
      {
        title: 'Seat Booked',
        dataIndex: 'seatsBooked',
      },
      {
        title: 'Status',
        dataIndex: 'status',
      },
    ];
    this.feedbackcolumns = [
      {
        title: 'User',
        dataIndex: 'user.name',
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),
      },
      {
        title: 'Trip',
        dataIndex: 'trip.name',
      },
      {
        title: 'Message',
        dataIndex: 'msg',
      },
      {
        title: 'Date',
        dataIndex: '_date',
      },
    ];
    this.notificationcolumns = [
      {
        title: 'Message',
        dataIndex: 'payload',
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
      },
      {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
      },
    ];
  }
  componentDidMount() {
    this.getFeedback();
    //this.getRecentBooking();
    this.dashbparddata();
    this.todaysbooking();
    // this.getnotification();
    this.getallUser();
    this.getGraphData();
    this.getTodayBooking();
  }
  getFeedback = () => {
    user.getfeedback().then(res => {
      // console.log(res);
      const data = res.data;
      if (data.status) {
        let feedbackdata = data.data;
        feedbackdata.forEach(function (row) {
          row['key'] = row.id;
          row['_date'] = moment(moment(row.date, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss A');
        });
        // console.log(feedbackdata)
        this.setState({
          feedback: feedbackdata,
        });
      }
    });
  };
  getnotification = () => {
    user.getnotification().then(res => {
      const data = res.data;
      if (data.status) {
        let notifiactiondata = data.data;

        notifiactiondata.forEach(function (row) {
          row['key'] = row.id;
          let endTime = moment(row.createdAt, 'HH:mm:ss a');
          let startTime = moment(new Date(), 'HH:mm:ss a');
          // calculate total duration
          let duration = moment.duration(endTime.diff(startTime));
          // duration in hours
          let hours = parseInt(duration.asHours());
          // duration in minutes
          let minutes = parseInt(duration.asMinutes()) % 60;
          row['duration'] = hours + ' hour ' + minutes + ' minutes ago';
          // console.log(row);
        });
        // console.log(notifiactiondata);

        this.setState({
          notifiaction: notifiactiondata,
          isNotification: true,
          isRecentBooking: false,
          isTodayBooking: false,
        });
      }
    });
  };

  dashbparddata = () => {
    user.dashbparddata().then(res => {
      // console.log(res);
      let data = res.data;
      if (data.status) {
        let dashboardTotals = data.data;
        this.setState({
          dashboard: dashboardTotals,
        });
      }
    });
  };
  getRecentBooking = () => {
    /*user.recentbooking().then(res => {
      const data = res.data;
      if (data.status) {
        let recentbookinglistdata = data.data;
        recentbookinglistdata.forEach(function (row) {
          row['key'] = row.id;
        });
        this.setState({
          recentbookinglist: recentbookinglistdata,
          isRecentBooking: true,
          isTodayBooking: false,
          isNotification: false,
        });
      }
    });*/
    const data = dashboard.getBooking();
     let date = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY')
    //let date = '01/01/1901';
    user.todayBooking({ date: date }).then(res => {
      // console.log(res)
      let data = res.data;
      if (data.status) {
        let recentbookinglistdata = data.data;
        recentbookinglistdata.key = 1;
        this.setState({
          recentbookinglist: [recentbookinglistdata],
          isRecentBooking: true,
          isTodayBooking: false,
          isNotification: false,
        })
      }

    })
  };
  todaysbooking = () => {
    user.todaysbooking().then(res => {
      let data = res.data;
      if (data.status) {
        let dashboardTotals = data.data;
        this.setState({
          todaybookingTotal: dashboardTotals,
          isRecentBooking: false,
          isTodayBooking: true,
          isNotification: false,
        }); 
      }
    });
  };
  month_name(dt) {
    const mlist = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return mlist[dt.getMonth()];
  }
   
  getGraphData = () => {
    user.getGraphData().then(res => {
      let data = res.data;
      let dates = [];
      let datas = [];
      let month = '';
      let setgraphdata = {};
      let sidebookingData = [];
      let colors = ['#00c0ef', '#dd4b39', '#00a65a', '#f39c12', '#337ab7'];
      if (data.status) {
        let dashboardTtls = data.data;
        // console.log(dashboardTotals);
        let dashboardTotals = dashboardTtls.sort((a, b) => new Date(b.date) - new Date(a.date))
        console.log(dashboardTotals)
        for (let val of dashboardTotals) {
          month = this.month_name(new Date(val.date));

          if (typeof setgraphdata[month] !=='undefined') { 
            for (let [i, row] of dates.entries()) {
              if (row === month) {
                datas[i] = parseFloat(datas[i]) + parseFloat(val.booked);
                sidebookingData[i].total = parseFloat(sidebookingData[i].total) + parseFloat(val.total);
              }
            }
          } else {
            console.log(month)
            console.log(setgraphdata[month])
            setgraphdata[month] = parseFloat(val.total);
            dates.push(month);
            datas.push(val.booked);
            let year = moment(val.date, 'YYYY').format('YYYY')
            sidebookingData.push({
              id: Math.floor((Math.random() * 1000) + 1),
              total: val.total,
              date: `${month}, ${year} Bookings`,
            })
          }

        }
        sidebookingData = sidebookingData.reverse();
        sidebookingData = sidebookingData.splice(0, 5);
        dates.reverse();
        datas.reverse();
        console.log(dates)
        this.setState({
          graphlabel: dates,
          graphdata: datas,
          sidebookingData: sidebookingData
        });
        // console.log(this.state.graphdata)
        // console.log(this.state.graphlabel)
      }
    });
    // dashboard.getBooking().then(res => {
    //   // const data = res.data;

    //  console.log(res);
    // });
  };
  getBooking = () => {
    this.setState({
      isRecentBooking: false,
      isTodayBooking: true,
      isNotification: false,
    })
    console.log(this.state.isTodayBooking)
    this.getTodayBooking()
    // this.setState({
    //   list: data,
    //   isRecentBooking: false,
    //   isTodayBooking: true,
    //   isNotification: false,
    // });
    // dashboard.getBooking().then(res => {
    //   // const data = res.data;

    //  console.log(res);
    // });
  };
  getTodayBooking = () => {
    const data = dashboard.getBooking();
    let date = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY')
    //let date = '01/01/1901';
    user.todayBooking({ date: date }).then(res => {
      console.log(res)
      let data = res.data;
      let todaybookeddata = {'currentBooked':0,'maxSeat':0}
      if (data.status) { 
        let todaybookingData = data.data;
        //todaybookingData = [{"currentBooked":"43","maxSeat":"32"},{"currentBooked":"43","maxSeat":"32"} ]
        console.log(todaybookingData)
        if(todaybookingData && todaybookingData.length>0){
          let totalBooked = 0;
          let totalMax = 0;console.log(todaybookingData)
          todaybookingData.forEach(function (row) {
              totalBooked = totalBooked+parseInt(row.currentBooked)
              totalMax = totalMax+parseInt(row.maxSeat)
          });
          todaybookeddata.currentBooked=totalBooked
          todaybookeddata.maxSeat=totalMax
        }
        todaybookingData.key = 1;
        this.setState({
          todaybookingData: todaybookeddata,
          list: todaybookingData
        })
        console.log(this.state.todaybookeddata)
      }

    })
    console.log(data);

  };
  getallUser = () => {
    user.list().then(res => {
      const data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        });
        list.unshift({ key: 'all', id: 'all', name: 'Select all' });

        this.setState({
          customer_list: list,
        });
      }
    });
  };
  handleCancel = () => {
    this.setState({
      customer_modal: false,
    });
  };
  handleInputChange = e => {
    //const name = e.target.name;
    const value = e.target.value;
    this.setState({
      usermessage: value,
    });
  };
  showmessageModal = e => {
    this.setState({
      customer_modal: true,
    });
  };
  handleCustomerChange = value => {
    console.log(value);
    let userIds = value;

    if (value && value.length && value.includes('all')) {
      userIds = [];
      for (let val of this.state.customer_list) {
        if (val.id !== 'all') {
          userIds.push(val.id);
        }
      }
      console.log(userIds);
    }
    this.setState({
      userIds: userIds,
    });
  };
  broadCastmessage = () => {
    const usermessage = this.state.usermessage;
    const userIds = this.state.userIds;
    this.setState({
      loading:true
    })
    console.log(this.state.usermessage)
    if(this.state.usermessage!==''){
    user.broadCastmessage({
      message: usermessage,
      userIds: userIds,
    }).then(res => {
      let data = res.data;
      this.setState({
        loading:false
      })
      if (data.status) {
        let dashboardTotals = data.data;
        this.setState({
          todaybookingTotal: dashboardTotals,
        });
        notification.success('Message send')
      }
    },err=>{
      notification.error('Api Error')

      this.setState({
        loading:false
      })
    });
  }else{
    notification.error('Please add message')
    this.setState({
      loading:false
    })
  }
  };
  render() {
    const { Option } = Select;

    const { TextArea } = Input;
    const data = {
      labels: this.state.graphlabel,
      datasets: [
        {
          label: 'Monthly Booking Chart',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: '#337ab7',
          data: this.state.graphdata,
        },
      ],
    };

    return (
      <>
        <section className="content">
        <ToastContainer />
          <div className="row dashboard-block">
            <div className="col-md-2 col-sm-6 col-xs-12">
              <div className="info-box">
                <span className="info-box-icon bg-aqua">
                  <i className="fa fa-fw fa-bus"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Total Bus</span>
                  <span className="info-box-number">
                    {this.state.dashboard.totalVehicle ? this.state.dashboard.totalVehicle : 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 col-xs-12">
              <div className="info-box">
                <span className="info-box-icon bg-red">
                  <i className="fa fa-fw fa-genderless"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Total Booking</span>
                  <span className="info-box-number">
                    {this.state.dashboard.totalBooking ? this.state.dashboard.totalBooking : 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 col-xs-12">
              <div className="info-box">
                <span className="info-box-icon bg-green">
                  <i className="fa fa-fw fa-genderless"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Total Journey</span>
                  <span className="info-box-number">
                    {this.state.dashboard.totalJourney ? this.state.dashboard.totalJourney : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6 col-xs-12">
              <div className="info-box">
                <span className="info-box-icon bg-yellow">
                  <i className="fa fa-fw fa-user"></i>
                </span>

                <div className="info-box-content">
                  <span className="info-box-text">Total Customer</span>
                  <span className="info-box-number">
                    {this.state.dashboard.totalCustomer ? this.state.dashboard.totalCustomer : 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 col-xs-12">
              <div className="info-box">
                <Link to={'/vehicle'}>
                  <span className="info-box-icon bg-yellow">
                    <i className="fa fa-fw  fa-map-marker"></i>
                  </span>

                  <div className="info-box-content">
                    <span className="info-box-text"><b>Live Tracking</b></span>

                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">Monthly Booking Chart</h3>
              </div>
              <div className="box-body">
                <div className="col-md-12">
                  <div
                    style={{
                      width: '100%',
                      height: '300px',
                    }}
                  >
                    <Line
                      data={data}
                      height={80}
                      options={{
                        title: {
                          display: false,
                        },
                        legend: {
                          display: false,
                          position: 'right',
                        },
                      }}
                    />
                  </div>
                </div> 
                {/*<div className="col-md-4 sideprogressbar">
                  <p><strong>Last Few Month Bookings</strong></p>
                  {
                    this.state.sidebookingData.map((val, i) => {
                      return (
                        <div className="progress-group" key={val.id}>
                          <span className="progress-text">{val.date}</span>
                          <span className="progress-number">
                            <b>{val.total}</b>
                          </span>

                          <div className="progress sm">
                            <div
                              className="progress-bar progress-bar-aqua"
                              style={{ width: '100%', background: this.state.color[i] }}
                            ></div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>*/}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="box">
                <div className="box-header with-border">
                  <h3 className="box-title">Live! Show</h3>
                </div>
                <div className="box-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="info-box bg-yellow">
                        <span className="info-box-icon">
                          <i className="fa fa-fw fa-bell"></i>
                        </span>
                        <div
                          className="info-box-content total_booking"
                          onClick={() => this.getnotification()}
                        >
                          <span className="info-box-text">Live! Alerts</span>
                          <span className="info-box-number">
                            {' '}
                            {this.state.dashboard.totalNotification
                              ? this.state.dashboard.totalNotification
                              : 0}
                          </span>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{
                                width: '50%',
                              }}
                            ></div>
                          </div>
                          {/* <span className="progress-description">
                          
                          </span> */}
                        </div>
                      </div>

                      <div
                        className="info-box total_booking bg-green"
                        onClick={() => this.getBooking()}
                      >
                        <span className="info-box-icon">
                          <i className="ion ion-ios-pricetag-outline"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">Today Booking
                          
                          </span>
                          <span className="info-box-number">
                            {/* {this.state.todaybookingData.currentBooked
                              ? this.state.todaybookingData.currentBooked
                              : 0}/{this.state.todaybookingData.maxSeat
                                ? this.state.todaybookingData.maxSeat
                                : 0} */}
                            {this.state.todaybookingData.currentBooked
                              ? this.state.todaybookingData.currentBooked
                              : 0}/{this.state.todaybookingData.maxSeat
                                ? this.state.todaybookingData.maxSeat
                                : 0}
                          </span>

                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{
                                width: '20%',
                              }}
                            ></div>
                          </div>
                          {/* <span className="progress-description">
                            '20%' Increase in 30 Days
                          </span> */}
                        </div>
                      </div>

                      {/* <div
                        className="info-box bg-red total_booking"
                        onClick={() => this.getRecentBooking()}>
                        <span className="info-box-icon">
                          <i className="fa fa-fw fa-check-circle-o"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">Recent Booking</span>
                          <span className="info-box-number">
                            {this.state.recentbookinglist.length}
                          </span>

                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{
                                width: '70%',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-md-8">
                      <div className="table-responsive">
                        {this.state.isTodayBooking ? (
                          <MTable data={this.state.list} column={this.columns} pagination={5} />
                        ) : this.state.isRecentBooking ? (
                          /*<MTable
                            data={this.state.recentbookinglist}
                            column={this.recentbookingcolumn}
                            pagination={5}
                          />*/
                          <MTable data={this.state.list} column={this.columns} pagination={5} />
                        ) : this.state.isNotification ? (
                          <MTable
                            data={this.state.notifiaction}
                            column={this.notificationcolumns}
                            pagination={5}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="box">
                    <div className="box-header with-border">
                      <h3 className="box-title">User Feed Back</h3>
                    </div>
                    <div className="box-body">
                      <div className="table-responsive">

                        <MTable
                          data={this.state.feedback}
                          column={this.feedbackcolumns}
                          pagination={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="box">
                    <div className="box-header with-border">
                      <h3 className="box-title">BroadCast Message</h3>
                    </div>
                    <div className="box-body">
                      <div className="form-group col-md-12 mb-4">
                        <Select
                          mode="multiple"
                          className="full-width"
                          name="point_from"
                          placeholder="Users"
                          defaultValue={this.state.userIds}
                          value={this.state.userIds}
                          onChange={e => this.handleCustomerChange(e)}
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                        >

                          {this.state.customer_list.map(val => {
                            return (
                              <Option key={val.id} value={val.id}>
                                {val.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>

                      <div className="form-group col-md-12">
                        <TextArea
                          className="form-control"
                          style={{ width: '100%' }}
                          placeholder="Write Message"
                          name="usermessage"
                          onChange={e => this.handleInputChange(e)}
                          value={this.state.usermessage}
                          rows={4}
                        />
                        {/* <RangePicker  format={this.format} className="full-width" onChange={this.onPriceDateChange} /> */}
                      </div>
                      <Button onClick={this.broadCastmessage} type="primary" loading={this.state.loading}>
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            title={'Manage Price'}
            visible={this.state.customer_modal}
            onOk={() => this.broadCastmessage()}
            onCancel={() => this.handleCancel()}
          >
            <div className="row mb-2">
              <div className="form-group col-md-6">
                <textarea
                  className="form-control"
                  style={{ width: '100%' }}
                  placeholder="Enter the seat"
                  name="usermessage"
                  onChange={e => this.handleInputChange(e)}
                  value={this.state.usermessage}
                ></textarea>
                {/* <RangePicker  format={this.format} className="full-width" onChange={this.onPriceDateChange} /> */}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <Select
                  mode="multiple"
                  className="full-width"
                  name="point_from"
                  placeholder="Users"
                  defaultValue={this.state.userIds}
                  onChange={e => this.handleCustomerChange(e)}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  <Option value="">User</Option>

                  {this.state.customer_list.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>
                        {val.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </Modal>
        </section>
      </>
    );
  }
}

export default Dashboard;
