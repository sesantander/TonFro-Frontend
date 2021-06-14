import React, { Component } from 'react'
import driver from '../../../services/driver';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
import BackComponent from '../BackComponent';
import { ToastContainer } from 'react-toastify';
import notification from '../../../services/notification';
import { Spin } from 'antd';
import noimage from '../../../assets/img/noimage.jpg'


class EditDriver extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'form': {
        "name": '',
        "lastname": '',
        // "username": '',
        "email": '',
        "mobile": '',
        "isActive": 1,
        "profile_image": null,
        'userType': 'driver',
        'gender': '',
        'approved': true,
        
      },
      'required': {
        "name": false,
        // "username": false,
        // "email": false,
        "mobile": false,
        "isActive": false,
      },
      'driverId': '',
      "loading": false,
      "response": {}

    };
    this.requiredText = ["name",
     // "username",
      // "email",
       "mobile", "isActive", "gender", "userType"];
    this.apiurl = process.env.REACT_APP_BASE_URL;



  }
  componentDidMount() {
    let params = this.props.match.params;
    if (typeof params.id !== 'undefined') {
      this.get(params.id);
      this.setState({
        driverId: params.id
      })
    }
  }
  clearForm = () => {
    console.log(this.form)
    this.setState({
      'form': {
        "name": '',
        "lastname": '',
        "username": '',
        "email": '',
        "mobile": '',
        "isActive": 1,
        "profile_image": null,
        'userType': 'driver',
        'gender': '',
        'approved': true,
        
      }
    });
    console.log(this.state.form)
  }
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required'])
    this.setState({ 'form': updatedValue.form, 'required': updatedValue.required });
  }
  get = (id) => {
    driver.get(id).then(res => {
      console.log(res);
      let form = this.state.form;
      let data = res.data;
      if (data.status) {
        this.setState({
          response: data.data
        });
        console.log(this.state.response.idProofImage)
        if (data.status) {
          let userdata = data.data;

          data = userdata.user
          if (data) {
            console.log(data);
            form['name'] = data.name;
            form['email'] = (data.email)?data.email:'';
            form['mobile'] = (data.mobile)?data.mobile:'';
            form['gender'] = data.gender;
            // form['password'] = data.password;
            // form['rpassword'] = data.password;
            // form['username'] = data.name;
            // this.setState({
            //   'driverId': data.id
            // })
            this.setState({
              form
            });
          }
        }
      }
    })

  }

  fileChangedHandler = event => {
    let state = this.state.form;
    state['profile_image'] = event.target.files[0];
    this.setState({ 'form': state });
    console.log(this.state)
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let req = this.state.required;
    let validate = true;
    const formData = new FormData(event.target);
    this.requiredText.forEach((v) => {
      if (this.state['form'][v] === '' || !this.state['form'][v]) {
        req[v] = true;
        validate = false;
        console.log(v)
        this.setState({
          'required': req
        });
        console.log(v)
        console.log(this.state)
      }
    });
        console.log(validate)

    if (validate) {
      const form = this.state.form;
      console.log(form);
      const numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
      // const numberRegex = /((\+*)((0[ -]+)*|(91 )*)(\d{12}|\d{10}))|\d{5}([- ]*)\d{6}/;
      
      const atposition = form.email.indexOf("@");
      const dotposition = form.email.lastIndexOf(".");
      if (form.email!='' && (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= form.email.length)) {
        notification.error('Invalid Email');
        this.setState({
          'loading': false
        });
      } else {
        if (form.mobile.length == 10 && numberRegex.test(form.mobile)) {
          this.setState({
            'loading': true
          });
          if (this.state.driverId !== '') {
            form['driverId'] = this.state.driverId;
            formData.append('driverId', this.state.driverId);
            this.update(form, formData)
          } else {
            formData.append('driverId', this.state.driverId);
            this.add(form, formData);
          }
        } else {
          notification.error('Mobile number should be number and 10 digit ')
          this.hideLoader();
        }
      }
    }

  }
  hideLoader() {
    this.setState({
      'loading': false
    });
  }
  add = (formData, form_data) => {
    driver.add(formData).then(res => {
      this.setState({
        'loading': false
      });
      let data = res.data;
      if (data.status) {
        data = data.data
        this.setState({
          'loading': false
        });

        let newform = new FormData();
        newform.append('driverId', data.id);
        for (let v of form_data) {
          // console.log(v);
          if (v[0] == 'image') {
            newform.append('image', v[1])
          }
          //console.log(v);

        }
        let vimage = document.getElementById('doc_file');
        if (vimage.files.length > 0) {
          this.uplodaimage(newform)
        }

        notification.success('Record Added');

      } else {
        notification.error(data.statusMessage)

      }
      //this.clearForm();
    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }
  uplodaimage(formdata) {
    console.log(formdata)
    driver.uplodaimage(formdata).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });

      // notification.success('Record Updated');

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })

  }
  update = (formData, form_data) => {
    formData['driverId'] = this.state.driverId;
    formData['name'] = `${formData['name']} ${formData['lastname']}`;
    formData['name'] = formData['name'].trim()
    driver.update(formData).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      let newform = new FormData();
      for (let v of form_data) {
        if (v[0] == 'image') {
          console.log(v);

          newform.append('image', v[1])
        }
        if (v[0] == 'driverId') {
          newform.append('driverId', v[1])
        }


      }
      let vimage = document.getElementById('doc_file');
      if (vimage.files.length > 0) {
        this.uplodaimage(newform)
      }
      notification.success('Record Updated');

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
              <h1>Edit Driver</h1>
            </div>
            <div className="pull-rigth">
              <BackComponent back="/driver"></BackComponent>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">Driver</h3>
              </div>
              <Spin spinning={this.state.loading} tip="Saving..." >
                <div className="box-body">
                   <div className="row">
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Name',
                          required: this.state["required"].name,
                          value: this.state["form"].name,
                          onChange: this.handleUserInput.bind(this),
                          name: 'name',
                          isRequired: true

                        }} />
                    </div>
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Lastname',
                          required: this.state["required"].lastname,
                          value: this.state["form"].lastname,
                          onChange: this.handleUserInput.bind(this),
                          name: 'lastname',
                          isRequired: false

                        }} />
                    </div>
                  
                
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Username',
                          required: this.state["required"].username,
                          value: this.state["form"].username,
                          onChange: this.handleUserInput.bind(this),
                          name: 'username',
                          isRequired: false

                        }} />
                    </div>
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Email',
                          required: this.state["required"].email,
                          value: this.state["form"].email,
                          onChange: this.handleUserInput.bind(this),
                          name: 'email',
                          isRequired: false,
                          type: 'email'

                        }} />
                    </div>
                 
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Mobile',
                          required: this.state["required"].mobile,
                          value: this.state["form"].mobile,
                          onChange: this.handleUserInput.bind(this),
                          name: 'mobile',
                          isRequired: true

                        }} />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group required">
                        <label className="control-label">Gender</label>
                        <select name="gender" value={this.state["form"].gender} className={
                          this.state["required"]["gender"]
                            ? "form-control error"
                            : "form-control"
                        }
                          onChange={(e) => this.handleUserInput(e)}>
                          <option value="" >
                            -- Select Status --
                            </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                   
                    <div className="col-md-6">
                      <div className="form-group required">
                        <label className="control-label">Status</label>
                        <select name="isActive" value={this.state["form"].isActive} className={
                          this.state["required"]["isActive"]
                            ? "form-control error"
                            : "form-control"
                        }
                          onChange={(e) => this.handleUserInput(e)}>
                          <option value="" >
                            -- Select Status --
                            </option>
                          <option value="1">Active</option>
                          <option value="0">Deactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group required">
                        <label className="control-label pt_5">Profile Image</label>
                        <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i> Upload
                         <input type="file" name="image" className="custome_file" id="doc_file" onChange={this.fileChangedHandler} />
                        </label>
                      </div>
                    </div>
                    </div>

                  
                   
                  {/* <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group required" style={{ textAlign: 'left' }}>
                        <Checkbox onChange={(e) => this.handleUserInput(e)} name="approved">Approve</Checkbox>
                      </div>
                    </div>
                  </div> */}
                  <div className="row mt-10">
                    <div className="col-sm-2">
                      <label>Id Proof Image</label>
                      <div className="driversimage">
                        {
                          (this.state.response.idProofImage) ? <img src={this.apiurl + '/getImage/' + this.state.response.idProofImage} /> : <img src={noimage} />
                        }
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <label>Address Proof Image</label>
                      <div className="driversimage">
                        {
                          (this.state.response.addProofImage) ? <img src={this.apiurl + '/getImage/' + this.state.response.addProofImage} /> : <img src={noimage} />
                        }
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <label>Driver Image</label>
                      <div className="driversimage">
                        {
                          (this.state.response.user) ? <img src={this.apiurl + '/getImage/' + this.state.response.user.image} /> : <img src={noimage} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>
              <ActionComponent loading={this.state.loading} clearForm={this.clearForm}></ActionComponent>

            </div>
          </form>
        </section>
      </>

    )
  }
}
export default EditDriver