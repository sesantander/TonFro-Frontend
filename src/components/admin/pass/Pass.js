import React, { Component } from "react";
import pass from "../../../services/pass";
import { Link } from "react-router-dom";
import MTable from "../MTable";
import { Button, Icon, Input } from "antd";
import { saveAs } from 'file-saver';
import moment from 'moment';


class Pass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
      filter: {
        "name": '',
        "trips": '',
        "validity": '',
        "isActive":'',
        "description": '',
        "isSuspended": '',
        "discPerRidePercentage":'',
        "additionalBenefit": '',
        "code":""
        
      },
    };
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => {
          a.name = a.name != null ? a.name : "";
          b.name = b.name != null ? b.name : "";
          return a.name.localeCompare(b.name);
        }
      },
      {
        title: "Code",
        dataIndex: "code"
      },
      {
        title: "Trips",
        dataIndex: "trips"
      },
      {
        title: "Validity",
        dataIndex: "validity"
      },
      {
        title: "Description",
        dataIndex: "description"
      },
      {
        title: "Is Active",
        dataIndex: "isActive"
      },
      
      
      {
        title: "isSuspended",
        dataIndex: "isSuspended",
        
      },

      {
        title: "discPerRidePercentage",
        dataIndex: "discPerRidePercentage",
        
      },
     

     
    
      {
        title: "additionalBenefit",
        dataIndex: "additionalBenefit"
      },


      
      {
        title: 'Created Date',
        dataIndex: '_date',
        sorter: (a, b) => {
          a.createdAt = a.createdAt != null ? a.createdAt : "";
          b.createdAt = b.createdAt != null ? b.createdAt : "";
          return moment(a.createdAt).unix() - moment(b.createdAt).unix()
        }
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
            <Button size="small" type="primary" className="mrg-rt">
              <Link to={"/pass/edit/" + record.id}  >
                <Icon type="edit" />
              </Link>
            </Button>
          </>
        )
      }
    ];
  }
  filter = (event) => {
    console.log(event)
    event.preventDefault();
    pass.filter(this.state.filter).then(res => {
      console.log(res);
      let data = res.data;
      console.log(data);

      if (data.status) {
        let list = data.data;
        list.forEach(function (row) {
          row["key"] = row.id;
          row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
          row.isActive=row.isActive.toString();
          row.isSuspended=row.isSuspended.toString();
         row.additionalBenefit=row.additionalBenefit.toString();
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
  componentDidMount() {
    this.getList();
  }
  getList = () => {
    pass.list().then(res => {
      const data = res.data;
      if (data.data) {

        let list = data.data;
        console.log("AACACA",list)
        list.forEach(function (row) {
          
          row["key"] = row.id;
          row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
          row.isActive=row.isActive.toString();
          row.isSuspended=row.isSuspended.toString();
         row.additionalBenefit=row.additionalBenefit.toString();
        });
        
        this.setState({
          loading: false,
          list: list,
          total: data.total / 10
        });
      }
    });
  };
  render() {

    return (
      <>
        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Pass</h1>
            </div>
            
            <div className="pull-rigth">
            
              <Link
                className="btn btn-default pull-right"
                to="/pass/purchased"
                data-toggle="tooltip"
                title="Purchased Passes">
                <i className="fa fa-plus"></i> Purchased Passes
              </Link>
            </div>
            
            <div className="pull-rigth">
            
              <Link
                className="btn btn-default pull-right"
                to="/pass/add"
                data-toggle="tooltip"
                title="Add Global Route Pass">
                <i className="fa fa-plus"></i> Add Global Route Pass
              </Link>
            </div>

          </div>
        </section>
        <section className="content">
          <form id="filterform" onSubmit={this.filter}>
            <div className="row">

             
              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Name"
                  name="name"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.name}
                />
              </div>

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Code"
                  name="code"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.code}
                />
              </div>


              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Trips"
                  name="trips"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.trips}
                />
              </div>

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Validity"
                  name="validity"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.validity}
                />
              </div>

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Description"
                  name="description"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.description}
                />
              </div>

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="isActive"
                  name="isActive"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.isActive}
                />
              </div>

              

             
             
              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="isSuspended"
                  name="isSuspended"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.isSuspended}
                />
              </div>

              
              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="discPerRidePercentage"
                  name="discPerRidePercentage"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.discPerRidePercentage}
                />
              </div>

              
             

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="additionalBenefit"
                  name="additionalBenefit"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.additionalBenefit}
                />
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
              <h3 className="box-title">Pass</h3>
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
export default Pass;
