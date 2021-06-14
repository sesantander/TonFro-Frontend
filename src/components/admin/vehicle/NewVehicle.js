import React, { Component } from "react";
import vehicle from "../../../services/vehicle";
import { Link } from "react-router-dom";
import notification from "../../../services/notification";
import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import { ToastContainer } from "react-toastify";
import noimage from "../../../assets/img/noimage.jpg";
import { Button, Icon, Select, Modal, Spin, Input } from "antd";

class NewVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: "",
        brand: "",
        service_type: "daily",
        model: "",
        vehicleNumber: "",
        engineNumber: "",
        maxSeat: "",
        description: "",
        isActive: "",
        imei:'',
      
      },
      required: {
        title: false,
        brand: false,
        model: false,
        vehicleNumber: false,
        isActive:false,

        maxSeat: false
      },
      imei:[],
      vehicleId: "",
      response: {}
    };

    this.requiredText = ["title", "brand", "model", "vehicleNumber", "maxSeat","isActive"];
    
    this.apiurl = process.env.REACT_APP_BASE_URL;
    

  }
  componentDidMount() {
    let params = this.props.match.params;
    
    if (typeof params.id !== "undefined") {
      this.get(params.id);
      this.setState({
        vehicleId: params.id
      });
    

    }
    this.getimei();
  }
 
  fileChangedHandler = event => {
   
    let file = event.target.files[0];
    
   
    this.setState({ file: file, filename: file.name });
  };
  handleUserInput(e) {
    const name = e.target.name;
    var value = e.target.value;

    if (name=="vehicleNumber") {
      value=e.target.value.replace(/[^\w\s]/gi,"")
    }

    const form = this.state["form"];
    form[name] = value;
    console.log(form)
    this.setState({ form: form });
    
  }
 
  getimei = () => {
    vehicle.getimei().then(res => {
      console.log(res);
      let data = res.data;
      if (data.status) {
        let dashboardTotals = data.data;
        dashboardTotals.forEach(function(row) {
        row['key'] = row.id;
      });
        this.setState({
          imei: dashboardTotals
        });
      }
    });
  };  
  
  addimei = (params) => {
    vehicle.addimei(params).then(res => {
      console.log(res);
      let data = res.data;
      if (data.status) {
         
      }
    });
  };
  handleImeiInput = (v) => {
     let form = this.state.form;
     form['imei'] = v;
     this.setState({
       form:form
     });
  };
  handleSubmit = event => {
    event.preventDefault();
    let req = this.state.required;
    let validate = true;
    const formData = new FormData(event.target);
  
    this.requiredText.forEach(v => {
      if (this.state["form"][v] === "") {
        req[v] = true;
        validate = false;
        this.setState({
          required: req
        });
       
      }
     
    });
    if (validate) {
      this.setState({
        loading: true
      });
      const form = this.state.form;

      if (this.state.vehicleId !== "") {
        form["vehicleId"] = this.state.vehicleId;
        

        this.update(form, formData);
      } else {
        this.add(form, formData);
      }
    }

    console.log("AAAAAAAAAAAAAAAAAAA",this.state.response.image)
  };


  get = id => {
    vehicle.get(id).then(res => {
      
      let form = this.state.form;
      let data = res.data;

      console.log("entroo")
      if(data.status){
      this.setState({
        response: data.data
      });
     
      if (data.status) {
        data = data.data;
        
        form["title"] = data.title;
        form["brand"] = data.brand;
        form["model"] = data.model;
        form["model"] = data.model;
        form["engineNumber"] = data.engineNumber;
        form["imei"] = (data.imei)?data.imei:'';
        form["vehicleNumber"] = data.vehicleNumber;
        form["description"] = data.description;
        form["maxSeat"] = data.maxSeat;
        form["service_type"] = data.service_type
          ? data.service_type
          : "";
        form["isActive"] = data.isActive ? 1 : 0;
        this.setState({
          vehicleId: data.id
        });
        console.log(data.service_type)
        this.setState({
          form
        });
      }
    }
    });

  };




  add = (formData, form_data) => {
    vehicle.add(this.state.form).then(
      res => {
       
        let data = res.data;
        this.setState({
          loading: false
        });
        if (data.status) {
         
           if(this.state.imei!=''){
            this.addimei({'imei':this.state.form.imei,'vehicleId':data.data.id});
          }
          this.setState({
            vehicleId: data.data.id
          });
          form_data.append('vehicleId', data.data.id);
          let vimage = document.getElementById("doc_file");
          if (vimage.files.length > 0) {
            this.uplodaimage(form_data);
          }
          notification.success("Vehicle Added");
         
        } else {
          notification.error(data.statusMessage);
        }
      },
      error => {
        this.setState({
          loading: false
        });
        console.log(error.response);
        notification.error("Api error");
      }
    );
  };
  uplodaimage(formdata) {
    
    vehicle.uplodaimage(formdata).then(
      res => {
        ;
        this.setState({
          loading: false
        });
        console.log("this.",this.state.vehicleId)
        notification.success("Image added");
        this.get(this.state.vehicleId)
        
      },
      error => {
        this.setState({
          loading: false
        });
        console.log(error.response);
        notification.error("Api error");
      }
    );
  }
 
  render() {
    const { Option } = Select;

    return (
      <>
        <section className="content-header">
          <ToastContainer />

          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Add Vehicle</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/vehicle"
                data-toggle="tooltip"
                title="Add Vehicle"
              >
                <i className="fa fa-long-arrow-left"></i>Back
              </Link>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">Vehicle</h3>
              </div>
              <div className="box-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Title</label>
                      <input
                        type="hiddle"
                        name="vehicleId"
                        value={this.state.vehicleId}
                        style={{ visibility: "hidden" }}
                        onChange={e => this.handleUserInput(e)}
                      />
                      <input
                        type="text"
                        name="title"
                        value={this.state["form"].title}
                        id="title"
                        className={
                          this.state["required"]["title"]
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="off"
                        placeholder="Title"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["title"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Service Type</label>
                      <select
                        name="service_type"
                        className={
                          this.state["required"]["service_type"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                        value={this.state["form"].service_type}
                      >
                        <option value="">Please Select</option>
                        <option value="daily">Daily Service</option>
                      </select>
                      {this.state["required"]["service_type"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={this.state["form"].brand}
                        id="brand"
                        className={
                          this.state["required"]["brand"]
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="off"
                        placeholder="Brand"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["brand"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={this.state["form"].model}
                        id="model"
                        className={
                          this.state["required"]["model"]
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="off"
                        placeholder="Model"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["model"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                 
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={this.state["form"].vehicleNumber}
                        id="vehicleNumber"
                        className={
                          this.state["required"]["vehicleNumber"]
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="off"
                        placeholder="Registration Number"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["vehicleNumber"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Engine Number</label>
                      <input
                        type="text"
                        name="engineNumber"
                        value={this.state["form"].engineNumber}
                        id="engineNumber"
                        className="form-control"
                        autoComplete="off"
                        placeholder="Engine Number"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["engineNumber"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Capacity</label>
                      <input
                        type="number"
                        min="0"
                        name="maxSeat"
                        value={this.state["form"].maxSeat}
                        id="maxSeat"
                        className={
                          this.state["required"]["maxSeat"]
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="off"
                        placeholder="MaxSeat"
                        onChange={e => this.handleUserInput(e)}
                      />
                      {this.state["required"]["maxSeat"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Status</label>
                      <select
                        name="isActive"
                        className={
                          this.state["required"]["isActive"]
                            ? "form-control error"
                            : "form-control"
                        }
                        value={this.state["form"].isActive}
                        onChange={e => this.handleUserInput(e)}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="1">Active</option>
                        <option value="0">Deactive</option>
                      </select>
                      {this.state["required"]["isActive"] ? (
                        <span className="span-error">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Imie</label>
                      
                      <Select
                          
                          className="full-width"
                          name="imei"
                          placeholder="Imei"
                          defaultValue={this.state.form.imei}
                          value={this.state.form.imei}
                          onChange={e => this.handleImeiInput(e)}
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: "100%" }}
                        >
                          

                          {this.state.imei.map(val => {
                            return (
                              <Option key={val.id} value={val.imei}>
                                {val.imei}
                              </Option>
                            );
                          })}
                        </Select>
                    </div>
                  </div>
                  </div>

                <div className="form-group">
                  <label className="control-label">Description</label>
                  <textarea
                    name="description"
                    cols="40"
                    rows="3"
                    id="description"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Description"
                    onChange={e => this.handleUserInput(e)}
                    value={this.state["form"].description}
                  ></textarea>
                </div>
                <div className="row">
                 
                 
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="control-label pt_5">Image</label>
                      <label htmlFor="doc_file" className="c_upload">
                        <i className="fa fa-upload c_upload"></i> Upload
                        <input
                          type="file"
                          id="doc_file"
                          name="image"
                          className="custome_file"
                          onChange={this.fileChangedHandler}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-sm-2 mt-10">
                    <label>Vehicle Image</label>
                    <div className="driversimage">
                      {this.state.response.image ? (
                        <img src={this.apiurl+'/getImage/'+this.state.response.image} />
                      ) : (
                        <img src={noimage} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <ActionComponent
                loading={this.state.loading}
               
              ></ActionComponent>
            </div>
          </form>
        </section>
      </>
    );
  }
}
export default NewVehicle;
