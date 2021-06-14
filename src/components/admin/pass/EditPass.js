import React, { Component } from "react";
import pass from '../../../services/pass';

import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import BackComponent from "../BackComponent";
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';

import NumberPicker from 'react-widgets/lib/NumberPicker'
import '../../../assets/css/newSelect.css';

class EditPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: "",
                trips: '',
                validity: "",
                isActive:"",
                isDynamic:"",
                description: "",
                isSuspended:"",
                isForAllTrip:"",
                isForAllPoint:"",
                discPerRidePercentage:"",
                additionalBenefit:"",
            
            },
            required: {
                name: false,

            },
            userId: '',
            loading: false
        };
        this.requiredText = ["name", "trips"];
    }

    componentDidMount() {
        let params = this.props.match.params;
        if (typeof params.id !== "undefined") {
            this.getPass(params.id);
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

    handleNumberInput(name,value) {
        const state = this.state.form;
      
        state[name] = value;
        console.log(this.state.form);
        this.setState({ validity: value });
      } 

    getPass = (id) => {
        
        pass.getPass(id).then(res => {
            let data = res.data;
            if (data.status) {
                const values = data.data;
                let form = this.state.form;

               
                form['name'] = values['name'];
                form['trips'] = values['trips'];
                form['validity'] = values['validity'];
                this.handleNumberInput("validity",values['validity']);
                form['isActive'] = (data.data.isActive) ? 1 : 0;
                form['isDynamic'] = (data.data.isDynamic) ? 1 : 0;
                form['description'] = values['description'];
                form['isSuspended'] = (data.data.isSuspended) ? 1 : 0;
                form['discPerRidePercentage'] = values['discPerRidePercentage'];
                form['additionalBenefit'] = (data.data.additionalBenefit) ? 1 : 0;
                form['passId'] = this.state.userId;
                form['isForAllTrip'] = (data.data.isForAllTrip) ? 1 : 0;
                form['isForAllPoint'] = (data.data.isForAllPoint) ? 1 : 0;
                
                
                console.log("Sbb",form)
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
                form['additionalBenefit'] = 0;
                formData.append('userId', this.state.userId);
                formData['additionalBenefit']= 0;
                
                this.update(form)
            } else {
                formData.append('userId', this.state.userId);

                this.add(form, formData);
            }


        }
    };



    add = (formData) => {

        pass.add(formData).then(res => {
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



                notification.success('Pass Added');

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

    update = (formData) => {
        formData['userId'] = this.state.userId;

        pass.update(formData,this.state.userId).then(res => {
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
                            <h1>Edit Pass</h1>
                        </div>
                        <div className="pull-rigth">
                            <BackComponent back="/pass"></BackComponent>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <form onSubmit={this.handleSubmit}>
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Pass</h3>
                                <div className="pull-rigth"></div>
                            </div>
                            <div className="box-body">
                                <div className="col-md-6">
                                    <InputComponent
                                        propValues={{
                                            label: "Name",
                                            required: this.state["required"].name,
                                            value: this.state["form"].name,
                                            onChange: this.handleUserInput.bind(this),
                                            name: "name",
                                            isRequired: true
                                        }}
                                    />
                                </div>
                               


                                <div className="col-md-6">
                                    <InputComponent
                                        propValues={{
                                            label: "Trips",
                                            required: this.state["required"].trips,
                                            value: this.state["form"].trips,
                                            onChange: this.handleUserInput.bind(this),
                                            name: "trips",
                                            isRequired: true
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
                                        <select name="isActive" value={this.state["form"].isActive} className={
                                            this.state["required"]["isActive"]
                                                ? "form-control error"
                                                : "form-control"
                                        }
                                            onChange={(e) => this.handleUserInput(e)}>
                                            <option value="" >
                                                -- Select --
                                      </option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>

                                
                              





                                <div className="col-md-6">
                                    <InputComponent
                                        propValues={{
                                            label: "Description",
                                            required: this.state["required"].description,
                                            value: this.state["form"].description,
                                            onChange: this.handleUserInput.bind(this),
                                            name: "description",
                                            isRequired: false
                                        }}
                                    />
                                </div>




                               


                                <div className="col-md-6">

                                    <div className={
                                        this.state["required"]["isSuspended"]
                                            ? "form-group has-error"
                                            : "form-group"
                                    } >
                                        <label className="control-label">Is Suspended?</label>
                                        <select disabled name="isSuspended" value={this.state["form"].isSuspended} className={
                                            this.state["required"]["isSuspended"]
                                                ? "form-control error"
                                                : "form-control"
                                        }
                                            onChange={(e) => this.handleUserInput(e)}>
                                            <option value="" >
                                                -- Select --
                                      </option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="col-md-6">

                            <div className={
                                this.state["required"]["isDynamic"]
                                    ? "form-group has-error"
                                    : "form-group"
                            } >
                                <label className="control-label">is Dynamic?</label>
                                <select disabled name="isDynamic" value={this.state["form"].isDynamic} className={
                                    this.state["required"]["isDynamic"]
                                        ? "form-control error"
                                        : "form-control"
                                }
                                    onChange={(e) => this.handleUserInput(e)}>
                                    <option value="" >
                                        -- Select --
                            </option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            </div>



                              

                                < div className="col-md-6">

                                <div className={
                                    this.state["required"]["isForAllTrip"]
                                        ? "form-group has-error"
                                        : "form-group"
                                } >
                                    <label className="control-label">Is ForAllTrip?</label>
                                    <select  disabled name="isForAllTrip" value={this.state["form"].isForAllTrip} className={
                                        this.state["required"]["isForAllTrip"]
                                            ? "form-control error"
                                            : "form-control"
                                    }
                                        onChange={(e) => this.handleUserInput(e)}>
                                        <option value="" >
                                            -- Select --
                                </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                </div>  

                                < div className="col-md-6">

                                <div className={
                                    this.state["required"]["isForAllPoint"]
                                        ? "form-group has-error"
                                        : "form-group"
                                } >
                                    <label className="control-label">Is ForAllPoint?</label>
                                    <select disabled name="isForAllPoint" value={this.state["form"].isForAllPoint} className={
                                        this.state["required"]["isForAllPoint"]
                                            ? "form-control error"
                                            : "form-control"
                                    }
                                        onChange={(e) => this.handleUserInput(e)}>
                                        <option value="" >
                                            -- Select --
                                </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                </div>
                               

                               

                            

                                <div className="col-md-6">
                                    <InputComponent
                                        propValues={{
                                            label: "discPerRidePercentage",
                                            required: this.state["required"].discPerRidePercentage,
                                            value: this.state["form"].discPerRidePercentage,
                                            onChange: this.handleUserInput.bind(this),
                                            name: "discPerRidePercentage",
                                            isRequired: true
                                        }}
                                    />
                                </div>




                                <div className="col-md-6">

                                    <div className={
                                        this.state["required"]["additionalBenefit"]
                                            ? "form-group has-error"
                                            : "form-group"
                                    } >
                                        <label className="control-label">Additional Benefit</label>
                                        <select disabled name="additionalBenefit" value={this.state["form"].additionalBenefit} className={
                                            this.state["required"]["additionalBenefit"]
                                                ? "form-control error"
                                                : "form-control"
                                        }
                                            onChange={(e) => this.handleUserInput(e)}>
                                            <option value="" >
                                                -- Select --
                                      </option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                        
                        <div className="col-md-6">
                        <label className="colPer2" >Validity</label>
                        <div className="form-group" >
                  
                            <div className="colPer">

                              <NumberPicker
                                  
                                  value={this.state.validity}
                                  onChange= {value => this.handleNumberInput("validity",value)}                       
                                  min={0}
                              />
                       </div>
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
export default EditPass;
