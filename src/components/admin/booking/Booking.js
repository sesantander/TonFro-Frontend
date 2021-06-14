import React, { Component } from "react";
import { DatePicker, Button, Select, Input, Icon } from "antd";
// import Tnftable from '../Tnftable';
// import FiterTable from '../FiterTable';
import route from "../../../services/route";
import MTable from "../MTable";
import point from "../../../services/point";
import user from "../../../services/user";
import { saveAs } from "file-saver";
import moment from 'moment';

import "./ponits.css";
import booking from "../../../services/booking";
// import user from '../../../services/user';
import { Link } from "react-router-dom";

//const fs = require("fs");
//const PDFDocument = require("pdfkit");

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
      charged:false,
      routes: [],
      points: [],
      date: "",
      date2: "",
      tempdate:'',
      tempdate2:'',
      status:"",
      rideStatus:"",
      filter: {
        name: "",
        mobile: "",
        sourcePoint: "",
        destinationPoint: "",
        orderId:"",
        JourneyBegin:"",
        JourneyEnd:"",
        status:"",
        rideStatus:""
       
      },
      source: "",
      tripId: "",
      destination: "",
      isSuperAdmin:""
    };
    this.heading = "Booking";
    this.columns = [
      {
        title: "User",
        dataIndex: "nameBookedFor"

        //   sorter: (a, b) => { return a.name.localeCompare(b.name) },
        //   //render: name => `${name.first} ${name.last}`,
        //   //...this.getColumnSearchProps('name'),
      },
    
      {
        title: "From",
        dataIndex: "sourcePoint.name"
      },
      {
        title: "To",
        dataIndex: "destinationPoint.name"
      },
    
      {
        title: "Trip Name",
        dataIndex: "trip.name"
      },
      {
        title: "Booking ID",
        dataIndex: "orderId"
      },
      {
        title: "Phone",
        dataIndex: "mobileBookedFor"
      },
      {
        title: "Price",
        dataIndex: "price"
      },
      {
        title: "Seat Booked",
        dataIndex: "seatsBooked"
      },
      {
        title: "Payment Mode",
        dataIndex: "payMethod"
      },
      {
        title: "Status",
        dataIndex: "status"
        // render: (text, record) => (
        //   (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        // ),
      },
      {
        title: "rideStatus",
        dataIndex: "rideStatus"
      },
      {
        title: "Date of Journey",
        dataIndex: "pickupTime",
        // render: (text, record) => (
        //   (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        // ),
      },
      {
        title: "actualPickupTime",
        dataIndex: ""
      },
      {
        title: "CreatedAt",
        dataIndex: "createdAt"
      },
      {
        title: "Drop Time",
        dataIndex: "dropTime"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
           

            <Button size="small" type="primary" className="mrg-rt" onClick={() => this.downloadInvoice(record)}>Invoice</Button>
          </>
        )
      }
      // {
      //   title: 'Action',
      //   key: 'action',
      //   render: (text, record) => (
      //     <><Button size="small" type="primary" className="mrg-rt"><Link to={'/journey/edit/' + record.id}><Icon type="edit" /></Link></Button>
      //       <Button size="small" type="primary" className="mrg-rt" onClick={() => this.showseatsModel(record.id, record.maxSeat)}>Seat</Button>
      //       <Button size="small" type="primary" className="mrg-rt" onClick={() => this.showPricessModel(record.id, record.maxSeat)}>Price</Button>

      //     </>
      //   ),
      // },
    ];
  }

  // componentWillMount(){}
  componentDidMount() {
    let params = this.props.match.params;
    console.log(params.id);
    if (typeof params.id !== "undefined") {
      this.setState({
        tripId: params.id
      });
    }
    this.getList();
    this.getRoutes();
    this.getPoints();
    this.checkSuperAdmin();
  }

  checkSuperAdmin() {
    // const x=JSON.parse(localStorage.getItem('userinfo'))
    // const xd={
    //   id:x.id
    // }
    // user.checkSuperAdmin(xd).then(res => {
     
    //   let data = res.data.data.userTypeId;
      
    //  if (data=="4") {
        
        
          this.setState({
            isSuperAdmin:<Link
            className="btn btn-default pull-right"
            to="/bookings/add"
            data-toggle="tooltip"
            title="Add Booking"
          >
            <i className="fa fa-plus"></i> Add Booking
          </Link> 
          });
        
   //   }
   // });
  }


  getPoints() {
    point.list().then(res => {
      console.log(res);
      let data = res.data;
      if (data.status) {
        let list = data.data;
        list.forEach(function(row) {
          row["key"] = row.id;
        });
        if (list) {
          this.setState({
            points: list
          });
        }
      }
    });
  }
  getRoutes = () => {
    route.list().then(res => {
      console.log(res);
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function(row) {
          row["key"] = row.id;
        });
        this.setState({
          routes: list
        });
      }
    });
  };

  handleOpenChange = open => {
    console.log("open1",open[0])
    console.log("open2",open[1])
    var formatted = moment(open[0], this.format).format('YYYY-MM-DD');
    var formatted2 = moment(open[1], this.format).format('YYYY-MM-DD');
    console.log("fon",formatted)
    console.log("fon2",formatted2)
    
    if (open[0] && open[1]) {
      
    
   let form = this.state["filter"];
    form['JourneyBegin'] = formatted;
    form['JourneyEnd'] = formatted2;
    this.setState({
      filter: form,
      date: open[0],
      date2: open[1]
    });
    

    }else{

 let form = this.state["filter"];
    form['JourneyBegin'] = "";
    form['JourneyEnd'] = "";
    this.setState({
      filter: form,
      date: "",
      date2: ""
    });
    

    }
  };
  



  handleSourceChange(value) {
    let form = this.state["filter"];
    form["sourcePoint"] = value;
    this.setState({
      filter: form
    });
    this.setState({
      source: value
    });
  }

  handlestatusChange(value) {
    let form = this.state["filter"];
    form["status"] = value;
    this.setState({
      filter: form
    });
    this.setState({
      status: value
    });
  }
  
  handleridestatusChange(value) {
    let form = this.state["filter"];
    form["rideStatus"] = value;
    this.setState({
      filter: form
    });
    this.setState({
      rideStatus: value
    });
   
  }
  reset = () => {
   
    let form = this.state["filter"];
    form["name"] = "";
    form["mobile"] = "";
    form["rideStatus"] = "";
    form["status"] = "";
    form["JourneyBegin"] = "";
    form["JourneyEnd"] = "";
    form["sourcePoint"] = "";
    form["destinationPoint"] = "";
    form["orderId"] = "";
    this.setState({
      filter: form,
      status:"",
      rideStatus:"",
      date:"",
      date2:"",
      source: "",
     destination: ""
    });
  

  }

  filter = () => {
    let filter = {};
    if (this.state.filter?.name != "") {
      filter["name"] = this.state.filter.name;
    }
    if (this.state.filter?.mobile != "") {
      filter["mobile"] = this.state.filter.mobile;
    }
    if (this.state.filter?.rideStatus != "") {
      filter["rideStatus"] = this.state.filter.rideStatus;
    }

    if (this.state.filter?.status != "") {
      filter["status"] = this.state.filter.status;
    }
    if (this.state.filter?.JourneyBegin != "") {
      filter["JourneyBegin"] = this.state.filter.JourneyBegin;
    }

    if (this.state.filter?.JourneyEnd != "") {
      filter["JourneyEnd"] = this.state.filter.JourneyEnd;
    }
    if (this.state.filter?.sourcePoint != "") {
      filter["sourcePoint"] = this.state.filter.sourcePoint;
    }
    if (this.state.filter?.destinationPoint != "") {
      filter["destinationPoint"] = this.state.filter.destinationPoint;
    }
    if (this.state.filter?.orderId != "") {
      filter["orderId"] = this.state.filter.orderId;
    }
  

    var duration = moment.duration({hours: 5, minutes: 30})
    booking.filter(filter).then(res => {
      let data = res.data;
      if (data.status) {
        let list = data.data;
        list.forEach(function(row) {
          row["key"] = row.id;
          row['pickupTime'] =  moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss a');
        // row['pickupTime'] = moment(moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a').subtract({ hours: 5, minutes: 30});//+919671286131
        
        row['dropTime'] = moment(row.dropTime, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss a');
        row['createdAt'] = moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss').add(duration).format('YYYY/MM/DD HH:mm:ss a')
        
       
        
        });

        
        this.setState({
          list: list,
          total: list.length / 10,
          loading: false
        });
      }
    });
  };
  handledestinationChange(value) {
    let form = this.state["filter"];
    form["destinationPoint"] = value;
    this.setState({
      filter: form
    });
    this.setState({
      destination: value
    });
  }
  handleFilterInput = e => {
    const form = this.state["filter"];
    form[e.target.name] = e.target.value;
    this.setState({
      filter: form
    });
  };
  getList = () => {
    booking.list().then(res => { 
      let data = res.data;
        this.setState({
        loading: false
      });
      if(data.status){
      let list = data.data;
      let listData = [];
      let currDate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY')
      // currDate = moment(moment('2020-02-24T00:00:00.000Z', 'YYYY/MM/DD'), 'MM/DD/YYYY').format('MM/DD/YYYY')
      var duration = moment.duration({hours: 5, minutes: 30})
 
      
      list.forEach(function(row) {
        row["key"] = row.id;
        //console.log(row.pickupTime)
        //console.log(moment(row.pickupTime).subtract( 330, 'minutes'))

        // row['pickupTime'] = moment(moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a');
        row['pickupTime'] =  moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss a');
        // row['pickupTime'] = moment(moment(row.pickupTime, 'YYYY/MM/DD HH:mm:ss')).format('YYYY/MM/DD HH:mm:ss a').subtract({ hours: 5, minutes: 30});
        
     

        row['dropTime'] = moment(row.dropTime, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss a');
        row['createdAt'] = moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss').add(duration).format('YYYY/MM/DD HH:mm:ss a')
        
      }); 
      if (this.state.tripId !== "") {
        for (let val of list) {
          val["key"] = val.id;
          let date = moment(moment(val.createdAt, 'YYYY/MM/DD'), 'MM/DD/YYYY').format('MM/DD/YYYY') 

          if (this.state.tripId == val.tripId && date==currDate) {
            listData.push(val);
          }
        }
      } else {
        listData = list;
      }
       
      this.setState({
        list: listData,
        total: listData.length / 10,
    
      }); 
    }
    });
  };
  onChange = (date, dateString) => {
    console.log(date, dateString);
  };


  downloadInvoice = (ob) => {
   
    var state2={
      name: ob.nameBookedFor,
      mobileBookedFor: ob.mobileBookedFor,
      orderId: ob.orderId,
      price: ob.price,
      seatsBooked:ob.seatsBooked,


    }
    booking.downloadInvoice(state2).then(res => { 
     
      
        this.setState({
          charged: true,
         
      
        }); 
       this.getInvoice();
  
      
      

    });
      
   


  }
  getInvoice = () => {
   
    booking.getInvoice().then(res => { 
     
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

       saveAs(pdfBlob, 'newPdf.pdf');


    }); 

  }
  downloadExcel = () => {
    
    
    let filter = {};
    if (this.state.filter?.name != "") {
      filter["name"] = this.state.filter.name;
    }
    if (this.state.filter?.mobile != "") {
      filter["mobile"] = this.state.filter.mobile;
    }
    if (this.state.filter?.rideStatus != "") {
      filter["rideStatus"] = this.state.filter.rideStatus;
    }

    if (this.state.filter?.status != "") {
      filter["status"] = this.state.filter.status;
    }
    if (this.state.filter?.JourneyBegin != "") {
      filter["JourneyBegin"] = this.state.filter.JourneyBegin;
    }

    if (this.state.filter?.JourneyEnd != "") {
      filter["JourneyEnd"] = this.state.filter.JourneyEnd;
    }
    if (this.state.filter?.sourcePoint != "") {
      filter["sourcePoint"] = this.state.filter.sourcePoint;
    }
    if (this.state.filter?.destinationPoint != "") {
      filter["destinationPoint"] = this.state.filter.destinationPoint;
    }
    if (this.state.filter?.orderId != "") {
      filter["orderId"] = this.state.filter.orderId;
    }

    

    booking.downloadExcel(filter).then(res => {
      
      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // let url = window.URL.createObjectURL(blob);
      //   let a = document.createElement('a');
      //   a.href = url;
      //   a.download = 'assets/excel.xlsX';
      //   a.click();
      saveAs(blob, "customers.xlsx");
    });
    
  };
  
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}
 

  render() {
    // const { RangePicker } = DatePicker;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <>
        {/*<FiterTable />
      // <Tnftable />*/}
        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>


            <div className="pull-rigth">
              {console.log("SDSADASD",this.state.isSuperAdmin)}
              {this.state.isSuperAdmin}
            </div>

          </div>
        </section>
        <section className="content">
          <div className="box">
            <div className="box-header with-border">
              <div className="pull-right">
                <Button type="primary" onClick={this.downloadExcel}>
                  Excel
                </Button>
              </div>
              <h3 className="box-title">{this.heading}</h3>
            </div>
            <div className="box-body">
              <div className="well clearfix">
                
               <div className="form-group col-md-3">
                 
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Booking code"
                    name="orderId"
                    onChange={e => this.handleFilterInput(e)}
                    value={this.state.filter.orderId}
                  />
                </div>
                
                <div className="form-group col-md-2">
                <RangePicker 
                 format={ this.format} 
                 placeholder="Journey Begin Date"
                 
                 value={[this.state.date,this.state.date2]} 
                 
                 onChange={this.handleOpenChange}
                />
              </div>




              <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="status"
                    //value={this.state.filter.status}
                    value={this.state.status?this.state.status:undefined}
                    placeholder='status'
                    onChange={e => this.handlestatusChange(e)}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                        <Option key={1} value={"canceled"}>
                          {"canceled"}
                        </Option>
                    } 

                    {
                        <Option key={2} value={"failed"}>
                          {"failed"}
                        </Option>
                    } 

                    {
                        <Option key={3} value={"pending"}>
                          {"pending"}
                        </Option>
                     }

                     {
                        <Option key={4} value={"booked"}>
                          {"booked"}
                        </Option>
                     }

                      {
                        <Option key={5} value={"refund"}>
                          {"refund"}
                        </Option>
                     }
                  </Select>
                </div>



                <div className="form-group col-md-3">
                  
               
                  <Select
                    className="full-width"
                    name="rideStatus"
                    //value={this.state.filter.rideStatus}
                    value={this.state.rideStatus?this.state.rideStatus:undefined}
                    placeholder='rideStatus'
                    onChange={e => this.handleridestatusChange(e)}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                      {
                        <Option key={1} value={"canceled"}>
                          {"canceled"}
                        </Option>
                    } 

                    {
                        <Option key={2} value={"notBooked"}>
                          {"notBooked"}
                        </Option>
                    } 

                    {
                        <Option key={3} value={"pending"}>
                          {"pending"}
                        </Option>
                     }

                     {
                        <Option key={4} value={"departed"}>
                          {"departed"}
                        </Option>
                     }
                      {
                        <Option key={5} value={"arrived"}>
                          {"arrived"}
                        </Option>
                     }
                     {
                        <Option key={6} value={"notArrived"}>
                          {"notArrived"}
                        </Option>
                     }
                  </Select>
                </div>






                <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="point_from"
                    value={this.state.source}
                    onChange={e => this.handleSourceChange(e)}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.points.map(val => {
                      return (
                        <Option key={val.id} value={val.id}>
                          {val.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>


                <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="destination"
                    value={this.state.destination}
                    onChange={e => this.handledestinationChange(e)}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.points.map(val => {
                      return (
                        <Option key={val.id} value={val.id}>
                          {val.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="form-group col-md-3">
                  
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Mobile"
                    name="mobile"
                    onChange={e => this.handleFilterInput(e)}
                    value={this.state.filter.mobile}
                  />
                </div>
                
                <div className="form-group col-md-3">
                  {/* <RangePicker className="full-width" onChange={this.onChange} /> */}
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Name"
                    name="name"
                    onChange={e => this.handleFilterInput(e)}
                    value={this.state.filter.name}
                  />
                </div>

                

                

                <div className="form-action col-md-3">
                  <div style={{ float: "left" }}>
                    <Button
                      type="submit"
                      className="btn btn-primary mrg-rt"
                      onClick={this.filter}
                    >
                      Submit
                    </Button>
                   
                  </div>
                </div>

                <div className="form-action col-md-3">
                  <div style={{ float: "left" }}>
                    <Button
                      type="submit"
                      className="btn btn-primary mrg-rt"
                      onClick={this.reset}
                    >
                      Reset
                    </Button>
                   
                  </div>
                </div>
                
                  
                

              </div>
              {/* <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Booking ID</th>
                    <th>Phone</th>
                    <th>Driver</th>
                    <th>Price</th>
                    <th>Payment Mode</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date of Journey  </th>
                    <th>Seats</th>
                    <th>Drop Time</th>
                    <th>Created</th>
                    <th>Invoice</th>
                  </tr>
                  {
                    this.state.list.map(val => {
                      return (
                        <tr key={val.id}>
                          <td>{val.name}</td>
                          <td>{val.email}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td> {val.role}</td>
                          <td>{val.enterprise_id}</td>
                          <td>
                            <Link to={'/user/edit/' + val.id} className="btn btn-info btn-xs">Edit</Link>
                            <button type="button" className="btn btn-warning btn-xs">Pass</button>
                          </td>
                        </tr>
                      )
                    })
                  }
                  
                </tbody>
              </table>   */}
              <div className="table-responsive">
                <MTable
                  data={this.state.list}
                  column={this.columns}
                  loading={this.state.loading}
                />
              </div>
            </div>
            {/* <Pagination total={this.state.total} onChange={this.handlePageClick} /> */}
          </div>
        </section>
      </>
    );
  }
}

export default Booking;
