import React, { Component } from "react";
import pass from "../../../services/pass";
import { Link } from "react-router-dom";
import MTable from "../MTable";
import { Button, Icon, Input,Select,Option,DatePicker } from "antd";
import { saveAs } from 'file-saver';
import moment from 'moment';
import point from "../../../services/point";

class PurchasedPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
      ridestatus:[],
      points:[],
      source: "",
      destination: "",
      ostatus:"",
      'date': "",
      'date2': "",
      filter: {

        "validUpto": '',
        "description ": '',
        "orderId": '',
        "createdAt":"",
        "validity": '',
        "price": '',
        "tripAllowed":'',
        "tripConsume": '',
        "code":"",
        "pointBegin":"",
        "pointEnd":"",
        "email": '',
        "mobile": '',
        "gender": '',
        "activateAt":"",
        "orderStatus":'',
        "rideStatus":''
      },
    };
    const format = 'YYYY-MM-DD';
    this.columns = [
      {
        title: "Username",
        dataIndex: "user.name",
        sorter: (a, b) => {
          a.name = a.name != null ? a.name : "";
          b.name = b.name != null ? b.name : "";
          return a.name.localeCompare(b.name);
        }
      },
      // {
      //   title: "Email",
      //   dataIndex: "user.email"
      // },
      {
        title: "Mobile",
        dataIndex: "user.mobile"
      },
      // {
      //   title: "Gender",
      //   dataIndex: "user.gender"
      // },
      {
        title: "validUpto",
        dataIndex: "validUpto"
      },
      {
        title: "description",
        dataIndex: "description"
      },
      {
        title: "orderId",
        dataIndex: "orderId"
      },
      {
        title: "createdAt",
        dataIndex: "createdAt"
      },
      {
        title: "validity",
        dataIndex: "validity"
      },
      
      
      {
        title: "price",
        dataIndex: "price",
        
      },

      {
        title: "tripAllowed",
        dataIndex: "tripAllowed",
        
      },

      {
        title: "tripConsume",
        dataIndex: "tripConsume"
      },
      {
        title: "points",
        dataIndex: "points"
      },
      {
        title: "code",
        dataIndex: "code"
      },
     
      {
        title: "activateAt",
        dataIndex: "activateAt"
      },
      {
        title: "Status",
        dataIndex: "orderStatus"
      },
      
     
    ];
  }
  filter = (event) => {
    console.log(event)
    event.preventDefault();

    pass.filterPurchasedPasses(this.state.filter).then(res => {
      console.log(res);
      let data = res.data;
      console.log(data);

      if (data.status) {
        let list = data.data;
        list.forEach(function (row) {
          row["key"] = row.id;
         row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
          row['validUpto'] = moment(moment(row.validUpto, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
         row['createdAt'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
         row['activateAt'] = moment(moment(row.activateAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
        
        });

        this.setState({
          list: list,
          total: (data.data.length / 10),
          loading: false
        });
      }
    })
  }
  downloadExcel = () => {
    pass.downloadExcel().then(res => {
      console.log(res)
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    
      saveAs(blob, 'pass.xlsx');
    })
  }
  handleFilterInput = (e) => {
    const form = this.state['filter'];
    form[e.target.name] = e.target.value;
    this.setState({
      filter: form
    })
  }

  // handleSourceChange(value) {
  //   let form = this.state["filter"];
  //   form["pointBegin"] = value;
  //   this.setState({
  //     filter: form
  //   });
  //   this.setState({
  //     source: value
  //   });
  // }

  // handledestinationChange(value) {
  //   let form = this.state["filter"];
  //   form["pointEnd"] = value;
  //   this.setState({
  //     filter: form
  //   });
  //   this.setState({
  //     destination: value
  //   });
  // }

  handlestatusChange(value) {
    let form = this.state["filter"];
    form["orderStatus"] = value;
    this.setState({
      filter: form
    });
    this.setState({
      ostatus: value
    });
  }

  handleOpenChange = open => {
    console.log("open2",open)
   
      var formatted = moment(open, this.format).format('YYYY-MM-DD');
      console.log("fon",formatted)
  

      if (open) {
        
      
     let form = this.state["filter"];
      form['activateAt'] = formatted;
      this.setState({
        filter: form
      });
      this.setState({
        'date': open
      })
  
      }else{
        let form = this.state["filter"];
        form['activateAt'] = "";
        this.setState({
          filter: form
        });
        this.setState({
          'date': ""
        })
    

      }
  
  };

  handleOpenChange2 = open => {
    console.log("open2",open)
    
    var formatted = moment(open, this.format).format('YYYY-MM-DD HH:mm:ss');
    console.log("fon",formatted)
    if (open) {
    
   let form = this.state["filter"];
    form['createdAt'] = formatted;
    this.setState({
      filter: form
    });
    this.setState({
      'date2': open
    })

    } else {
       let form = this.state["filter"];
    form['createdAt'] = "";
    this.setState({
      filter: form
    });
    this.setState({
      'date2': ""
    })
    }
  

  };


  componentDidMount() {
    this.getList();
    this.getPoints();
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

  
  
  getList =  () => {
     pass.listPurchasedPasses().then(res => {
      const data = res.data;
      if (data.data) {
        let list = data.data;
        
         

        list.forEach(function (row) {
        
        
         row["key"] = row.id;
         row['validUpto'] = moment(moment(row.validUpto, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
         row['createdAt'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
         row['activateAt'] = moment(moment(row.activateAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
         row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
    
        });
        
        
     


        console.log("ddddd",data)
        this.setState({
          loading: false,
          list: list,
          total: data.total / 10
        });
      }
    });

   

  };
  render() {
    const { Option } = Select;
    return (
      <>

        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Purchased Passes</h1>
            </div>
          </div>
        </section>

        <section className="content">
          <form id="filterform" onSubmit={this.filter}>
            <div className="row">

            <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Username"
                  name="username"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.username}
                />
              </div>

                {/* <div className="form-group col-md-2">
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Email"
                        name="email"
                        onChange={(e) => this.handleFilterInput(e)}
                        value={this.state.filter.email}
                    />
                </div> */}

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Mobile"
                  name="mobile"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.mobile}
                />
              </div>
             
              {/* <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Gender"
                  name="gender"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.gender}
                />
              </div> */}

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Description "
                  name="description "
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.description }
                />
              </div>

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="orderId"
                  name="orderId"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.orderId}
                />
              </div>

             

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Validity"
                  name="validity"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.validity}
                />
              </div>

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Price"
                  name="price"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.price}
                />
              </div>
             
              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="tripAllowed"
                  name="tripAllowed"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.tripAllowed}
                />
              </div>

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="tripConsume"
                  name="tripConsume"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.tripConsume}
                />
              </div>

              <div className="form-group col-md-2">
                <Input
                  style={{ width: '100%' }}
                  placeholder="code"
                  name="code"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.code}
                />
              </div>
        

                  {/* <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="pointBegin"
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
                        <Option key={val.id} value={val.name}>
                          {val.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div> */}


{/* 
                <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="pointEnd"
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
                        <Option key={val.id} value={val.name}>
                          {val.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
 */}



           

              


              <div className="form-group col-md-2">
                <DatePicker 
                 format={ this.format} 
                 placeholder="activateAt"
                 
                 value={this.state.date} 
                 onChange={this.handleOpenChange}
                />
              </div>

              <div className="form-group col-md-2">
              <DatePicker 
                 format={ this.format} 
                  placeholder="createdAt"
                  
                
                  value={this.state.date2}
                  onChange={this.handleOpenChange2}
                />
              </div>


                <div className="form-group col-md-3">
                  <Select
                    className="full-width"
                    name="ostatus"
                    value={this.state.ostatus?this.state.ostatus:undefined}
                    placeholder="orderStatus"
                    onChange={e => this.handlestatusChange(e)}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                        <Option key={1} value={"completed"}>
                          {"completed"}
                        </Option>
                    } 

                    {
                        <Option key={2} value={"pending"}>
                          {"pending"}
                        </Option>
                     }

                     {
                        <Option key={3} value={"failed"}>
                          {"failed"}
                        </Option>
                     }
                  </Select>
                </div>


               
                      
                






              <div className="col-md-2">
                <Button type="primary pull-left" htmlType="submit">Search</Button>
              </div>


            </div>
          </form>

          <div className="box">
            <div className="box-header with-border">
              <div className="pull-right">
                <Button
                  type="primary"

                  onClick={this.downloadExcel}>
                  Excel
              </Button>
              </div>
              <h3 className="box-title">Purchased Passes</h3>
            </div>
            <div className="box-body table-responsive">
              <MTable
                data={this.state.list}
                column={this.columns}
                loading={this.state.loading}
              />
            </div>
          </div>

        </section>

      </>
    );
  }
}
export default PurchasedPass;
