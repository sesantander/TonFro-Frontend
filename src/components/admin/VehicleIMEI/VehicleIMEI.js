import React, { Component } from "react";
import vehicleIMEI from "../../../services/vehicleIMEI";
import { Link } from "react-router-dom";
import MTable from "../MTable";
import { Button, Icon, Input } from "antd";
import { saveAs } from 'file-saver';
import moment from 'moment';


class VehicleIMEI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
      filter: {
        "imei": '',
        "isActive": '',
        "vehicleId": ''
       
        
      },
    };
    this.columns = [
     
      {
        title: "Imei",
        dataIndex: "imei"
      },
      {
        title: "isActive",
        dataIndex: "isActive"
      },
      {
        title: "Vehicle number",
        dataIndex: "vehicle.vehicleNumber"
      },
      


     
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
            <Button size="small" type="primary" className="mrg-rt">
               <Link to={"/vehicleIMEI/edit/" + record.id}  >
                <Icon type="edit" />
              </Link>
            </Button>
          </>
        )
      }
    ];
  }
  
  downloadExcel = () => {
    vehicleIMEI.downloadExcel().then(res => {
      console.log(res)
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    
      saveAs(blob, 'vehicleIMEI.xlsx');
    })
  }
 
  componentDidMount() {
    this.getList();
  }
  getList = () => {
    vehicleIMEI.list().then(res => {
      const data = res.data;
      
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          
          row["key"] = row.id;
           row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');
          row.isActive=row.isActive.toString();
         
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
              <h1>vehicleIMEI</h1>
            </div>
            
          
            
            <div className="pull-rigth">
            
              <Link
                className="btn btn-default pull-right"
                to="/vehicleIMEI/add"
                data-toggle="tooltip"
                title="Add VehicleIMEI">
                <i className="fa fa-plus"></i> Add VehicleIMEI
              </Link>
            </div>

          </div>
        </section>
        <section className="content">
        
          <div className="box">
            <div className="box-header with-border">
              <div className="pull-right">
                <Button
                  type="primary"

                  onClick={this.downloadExcel}>
                  Excel
              </Button>
              </div>
              <h3 className="box-title">vehicleIMEI</h3>
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
export default VehicleIMEI;
