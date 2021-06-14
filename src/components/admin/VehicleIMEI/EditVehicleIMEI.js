import React, { Component } from "react";
import vehicleIMEI from "../../../services/vehicleIMEI";

import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import BackComponent from "../BackComponent";
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';




class EditVehicleIMEI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
               
                imei: "",
                isActive:"",
               
              
            
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
        
        this.setState({ form: state });
    }

  
    getvehicleIMEI = (id) => {
       
        vehicleIMEI.getvehicleIMEI(id).then(res => {
            let data = res.data;
            
            if (data.status) {
                const values = data.data;
                let form = this.state.form;

              
                form['imei'] = values[0].imei;
                form['isActive'] = (data.data.isActive) ? 1 : 0;
                
                
               
                this.setState({
                    form: form,
                    load: false
                })
            }

        })
    }

    handleSubmit = event => {
        event.preventDefault();
        let req = this.state.required;
        const formData = new FormData(event.target);
        this.requiredText.forEach(v => {
            if (this.state["form"][v] === "" || !this.state['form'][v]) {
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
            } 


        }
    };




    update = (formData) => {
        formData['userId'] = this.state.userId;

        vehicleIMEI.update(formData,this.state.userId).then(res => {
            const resdata = res.data;

            this.setState({
                'loading': false
            });
            if (resdata.status) {
                let newform = new FormData();
                newform.append('userId', this.state.userId);


                notification.success('Record Updated');
            } else {
                notification.error(resdata.statusMessage);

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
                            <h1>Edit vehicleIMEI</h1>
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
                                <h3 className="box-title">vehicleIMEI</h3>
                                <div className="pull-rigth"></div>
                            </div>
                            <div className="box-body">
                                
                            <div className="col-md-6">
                                    <InputComponent
                                        propValues={{
                                            label: "Imei",
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
                                        this.state["isActive"]
                                            ? "form-group has-error"
                                            : "form-group"
                                    } >
                                        <label className="control-label">Is Active?</label>
                                        <select disabled name="isActive" value={this.state["form"].isActive} className={
                                            this.state["isActive"]
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
export default EditVehicleIMEI;
