import React, { Component } from "react";
import user from '../../../services/user';
// import ReactPaginate from 'react-paginate';
// import { Link } from 'react-router-dom';
import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import BackComponent from "../BackComponent";
// import { DatePicker,Input,Button,Select  } from 'antd';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import noimage from '../../../assets/img/noimage.jpg' 


class EditCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: "",
        // "username": '',
        // "email": '',
        mobile: "",
        gender: "",
        mobile:"",
        email:"",
        deviceId: "browser",
        // token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1YTkxZDlmMzlmYTRkZTI1NGExZTg5ZGYwMGYwNWI3ZTI0OGI5ODUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG9uZnJvLWRldiIsImF1ZCI6InRvbmZyby1kZXYiLCJhdXRoX3RpbWUiOjE1Nzk2MDI1MTUsInVzZXJfaWQiOiI5M1FBc2ZZcmRzUjdDTUQ0dmV1ckxtYVo2eDUyIiwic3ViIjoiOTNRQXNmWXJkc1I3Q01ENHZldXJMbWFaNng1MiIsImlhdCI6MTU3OTYwMjUxNSwiZXhwIjoxNTc5NjA2MTE1LCJwaG9uZV9udW1iZXIiOiIrOTE5MjA1MjE0MDE1IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrOTE5MjA1MjE0MDE1Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.c6LF-xx4GJ7CKzav8A8C0GUJfz1sptOQSQdUeg7UpzCrvONmPSrrRfXjmBQ-jdPEKSTn2Xt2EI3ibbQGh87YuvN73CdxRxkRtfzy7kD3R_vao9pBS0w1w6nnglzE4qehT0ARVORG4HeCoi1HNJolNVaQDxzWiYw9c_rFyPTKBNSSvA8lnZ2gqF91rh1Dxulmy3hi-sosWYIIzSG5uJep73NI2YsqoBtfByVKaE1mH3FMHdqB-maZd522fdb_Cv5x5TljC0N9WzmltC3a8pdGk9yCcOyP2siPdyIc_M2Uc1aX6HcFWniIl22n2c7Z1R1x3J1X4WiacDvYZRlH1qQ8tA",
        userType: "user",
        lastname: ""

        // "profile_image": null ,
      },
      required: {
        name: false,
        // "username": false,
        "email": false,
        mobile: false,
       
        gender: false,
      
      },
      userId: '',
      image:null,
      loading: false,
      load: false
    };
    this.requiredText = ["name", "mobile", "gender","email"];
    this.apiurl = process.env.REACT_APP_BASE_URL;

  }
  componentDidMount() {
    let params = this.props.match.params;
    if (typeof params.id !== "undefined") {
      this.getUser(params.id);
      this.setState({
        userId: params.id,
        load:true
      })
    }
  }
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const state = this.state.form;
    state[name] = value;
    // console.log(this.state.form);
    this.setState({ form: state });
  }
  getUser = (id) =>{
        user.getUser(id).then(res=>{
            console.log(res)
            let data = res.data;
            if(data.status){
              const values = data.data;
              let form = this.state.form;
              form['email'] = (values['email'])?values['email']:'';
              form['mobile'] = (values['mobile'])?values['mobile']:'';
              form['name'] = values['name'];
              form['gender'] = values['gender'];
              this.setState({
                form:form,
                image:values.image,
                load:false
              })
            }

        })
  }

  fileChangedHandler = event => {
    let state = this.state.form;
    state["profile_image"] = event.target.files[0];
    this.setState({ form: state });
    console.log(this.state);
  };
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
        this.setState({
          'loading': true
        });
        let form = this.state.form;
        const atposition=form.email.indexOf("@");  
        const dotposition=form.email.lastIndexOf(".");  
       if (form.email!='' && (atposition<1 || dotposition<atposition+2 || dotposition+2>=form.email.length)){ 
            notification.error('Invalid Email');
              this.setState({
              'loading': false
            });
            }else{
        const numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
        
       if(form.mobile.length==10 && numberRegex.test(form.mobile)){
        if (this.state.userId !== '') {
          form['userId'] = this.state.userId;
          formData.append('userId', this.state.userId);
          this.update(form, formData)
        } else {
          formData.append('userId', this.state.userId);
          this.add(form, formData);
        }
       }else{
        notification.error('Mobile number should be number and 10 digit ')
          this.setState({
              'loading': false
            });
     }
     }
    }
  };
  add = (formData, form_data) => {

    delete formData['rpassword'];
    user.add(formData).then(res => {
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
        newform.append('userId', data.id);
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
     this.setState({
        'loading': true
      });
    user.uplodaimage(formdata).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      this.getUser(this.state.userId)     
      // notification.success('Record Updated');

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })

  }
  update = (formData, form_data) => {
    formData['userId'] = this.state.userId;
    formData['deviceId'] = formData['mobile'];
    formData['name'] = `${formData['name']} ${formData['lastname']}`;
    user.update(formData).then(res => {
      const resdata = res.data;

      this.setState({
        'loading': false
      });
      if(resdata.status){
      let newform = new FormData();
       newform.append('userId', this.state.userId);
      for (let v of form_data) {
        console.log(v);
        if (v[0] === 'image') {
          newform.append('image', v[1])
        }
      }
      let vimage = document.getElementById('doc_file');
      if (vimage.files.length > 0) {
        this.uplodaimage(newform)
      }
      notification.success('Record Updated');
}else{
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
              <h1>Edit Customer</h1>
            </div>
            <div className="pull-rigth">
              <BackComponent back="/customer"></BackComponent>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">Customer</h3>
                <div className="pull-right" style={{position: 'relative'}}>
                 {
                          (this.state.load)?
                <div className="loader button-loader spinner" style={{paddingLeft: '2.5rem','marginTop':'13px'}} ></div>:null
           
         }
           </div>
              </div>
              <div className="box-body">
                <div className="row">
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
                                          label:'Lastname',
                                          required:this.state["required"].lastname,
                                          value:this.state["form"].lastname,
                                          onChange:this.handleUserInput.bind(this),
                                          name:'lastname',
                                          isRequired:false

                                        }}  />
                      </div> 
                       

                  {/* <div className="col-md-6">
                                    <InputComponent 
                                        propValues={{
                                          label:'Lastname',
                                          required:this.state["required"].lastname,
                                          value:this.state["form"].lastname,
                                          onChange:this.handleUserInput.bind(this),
                                          name:'lastname',
                                          isRequired:false

                                        }}  />
                      </div> */}
                </div>
                <div className="row">
                <div className="col-md-6">
                <div className={
                          this.state["required"]["mobile"]
                            ? "form-group required has-error"
                            : "form-group required"
                        }>
                      <label className="control-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        value={this.state["form"].mobile}
                        id="mobile"
                        autoComplete="off"
                        placeholder="Mobile"
                        className={
                          this.state["required"]["mobile"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                      />
                    </div>
               </div>
                <div className="col-md-6">
                <div className={
                          this.state["required"]["email"]
                            ? "form-group required has-error"
                            : "form-group required"
                        }>
                      <label className="control-label">Email</label>
                      <input
                        type="text"
                        name="email"
                        value={this.state["form"].email}
                        id="email"
                        autoComplete="off"
                        placeholder="Email"
                        className={
                          this.state["required"]["email"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                      />
                    </div>
               </div>
                  {/* <div className="col-md-6">
                        <div className="form-group required">
                          <label className="control-label">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={this.state["form"].username}
                            id="username" 
                            autoComplete="off"
                            placeholder="Username"
                            className={
                              this.state["required"]["username"]
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}
                          />
                        </div>
                      </div> */}
                  {/* <div className="col-md-6">
                        <div className="form-group required">
                          <label className="control-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={this.state["form"].email}
                            id="email"
                             
                            autoComplete="off"
                            placeholder="Email"
                            className={
                              this.state["required"]["email"]
                                ? "form-control error"
                                : "form-control"
                            }
                            onChange={(e) => this.handleUserInput(e)}
                          />
                        </div>
                      </div> */}
                </div>
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={this.state["form"].password}
                        id="password"
                        autoComplete="off"
                        placeholder="Password"
                        className={
                          this.state["required"]["password"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Re-Type Password</label>
                      <input
                        type="password"
                        name="rpassword"
                        value={this.state["form"].rpassword}
                        id="rpassword"
                        placeholder="Re-Type Password"
                        autoComplete="off"
                        className={
                          this.state["required"]["rpassword"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                      />
                    </div>
                  </div>
                </div>*/}
                <div className="row"> 
                  <div className="col-md-6">
                    <div className="form-group required">
                      <label className="control-label">Gender</label>
                      <select
                        name="gender"
                        value={this.state["form"].gender}
                        className={
                          this.state["required"]["gender"]
                            ? "form-control error"
                            : "form-control"
                        }
                        onChange={e => this.handleUserInput(e)}
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="form-group required">
                          <label className="control-label pt_5">Profile Image</label>
                          <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i> Upload
                         <input type="file" className="custome_file" name="image" id="doc_file" onChange={this.fileChangedHandler }/>
                         </label>
                        </div>
                        </div>
                </div>
                {/* <div className="row">
                      <div className="col-sm-3">
                        <div className="form-group required">
                          <label className="control-label pt_5">Profile Image</label>
                          <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i> Upload
                         <input type="file" className="custome_file" id="doc_file" onChange={this.fileChangedHandler }/>
                         </label>
                        </div>
                      </div>
                    </div> */}
                     <div className="row">
                    <div className="col-sm-2 mt-10">
                        <label>Customer Image</label>
                        <div className="driversimage">
                          {
                          (this.state.image)?<img src={this.apiurl+'/getImage/'+this.state.image} />:<img src={noimage} />
                           }
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
export default EditCustomer;
