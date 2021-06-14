import React, { Component } from "react";
import vehicleIMEI from "../../../services/vehicleIMEI";

import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import BackComponent from "../BackComponent";
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import NumberPicker from 'react-widgets/lib/NumberPicker'
import '../../../assets/css/newSelect.css';


class NewVehicleIMEI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        imei: "",
        vehicleID: null,
        isActive:"1",
      
       },
      required: {
        imei: false,
       
      },
      userId: '',
      loading: false
    };
    this.requiredText = ["imei"];
  }

  componentDidMount() {
    let params = this.props.match.params;
    if (typeof params.id !== "undefined") {
      this.getvehicleIMEI(params.id);
      this.setState({
        userId: params.id
      })
    }
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const state = this.state.form;

    state[name] = value;
    console.log(this.state.form);
    this.setState({ form: state });
  }



  handleSubmit = event => {
    event.preventDefault();
    let req = this.state.required;
    const formData = new FormData(event.target);
    this.requiredText.forEach(v => {
      if (this.state["form"][v] === ""  || !this.state['form'][v]) {
        req[v] = true;

        this.setState({
          required: req
        });
        console.log(this.state);
      }
    });

    let validate = true;
    this.requiredText.forEach((v) => {
      if (this.state['form'][v] === '') {
        req[v] = true;
        validate = false;
        console.log(v)
        this.setState({
          'required': req
        });
        console.log(this.state)
      }
    });


    if (validate) { 
       let form = this.state.form;
        
        console.log(this.state)
        this.setState({
          'loading': true
        });
        if (this.state.userId !== '') {
          form['userId'] = this.state.userId;
          formData.append('userId', this.state.userId);
          this.update(form, formData)
        } else {
          formData.append('userId', this.state.userId);

           this.add(form, formData);
        }
     

    }
  };



  add = (formData) => {

    
    vehicleIMEI.add(formData).then(res => {
      this.setState({
        'loading': false
      });
      let data = res.data;
      if (data.status) {
        data = data.data
        console.log(data);

        this.setState({
          'loading': false
        });

        let newform = new FormData();
        newform.append('userId', data.userId);
    


        notification.success('VehicleIMEI Added');
        setTimeout(function() {
          window.location = '/vehicleIMEI';
        }, 2000);
       
      } else {
        notification.error(data.statusMessage)

      }
    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }


  render() {
    return (
      <>
        <section className="content-header">
          <ToastContainer />

          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Add VehicleIMEI</h1>
            </div>
            <div className="pull-rigth">
              <BackComponent back="/vehicleIMEI"></BackComponent>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">VehicleIMEI</h3>
                <div className="pull-rigth"></div>
              </div>

              <div className="box-body"> 
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: "imei",
                        required: this.state["required"].imei,
                        value: this.state["form"].imei,
                        onChange: this.handleUserInput.bind(this),
                        name: "imei",
                        isRequired: true,
                        type:"number"
                      }}
                    />
                  </div>
                   
                
                 
                  

                  <div className="col-md-6">
                      
                      <div className={
                        this.state["required"]["isActive"]
                          ? "form-group has-error"
                          : "form-group"
                      } >
                        <label className="control-label">Is Active?</label>
                        <select disabled name="isActive" value={this.state["form"].isActive} className={
                          this.state["required"]["isActive"]
                            ? "form-control error"
                            : "form-control"
                        }
                          onChange={(e) => this.handleUserInput(e)}>
                          
                          <option value="1">Yes</option>
                       
                        </select>
                      </div>
                    </div>

                   
               
                    
             
                 


                     
              
              </div>
              <ActionComponent loading={this.state.loading}></ActionComponent>
            </div>
          </form>
        </section>
      </>
    );
  }

}
export default NewVehicleIMEI;
