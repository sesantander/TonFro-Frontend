import React, { Component } from 'react';
import auth from '../../services/auth';
// import {history} from '../../helpers/history';
import '../../assets/css/login.css';

// import { Route, Link, BrowserRouter,withRouter  } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import notification from '../../services/notification';
class Login extends Component {
  constructor(props) {
    super(props)
    this.email = React.createRef();
    this.password = React.createRef();
    this.state = {
      error: false,
    }
  }
  login = () => {
    console.log(this.email.current.value)
    auth.login({ 'mobile': this.email.current.value, password: this.password.current.value, 'userType': 'admin' }).then(res => {
      console.log(res);
      const res1 = res.data;
      
      if(res1.status){
        const data = res1.data
        console.log(data);
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3NTAzNDU1MDU3IiwiaWQiOjEsImlhdCI6MTU3NzU4NzkzMX0.Rz20o7tDtHUkVLBzCmAu7_kcmM_CqaTFL0s8bHuy4ag';
      localStorage.setItem('token', data.token);
      localStorage.setItem('userinfo',JSON.stringify(data.user));
      console.log(data);
      
      window.location.pathname=`${process.env.PUBLIC_URL}/dashboard`; 
      }else{
        console.log(res1)
        this.setState({
          error: true,
        });
        //notification.error(res.statusMessage)
      }
      //turn <Redirect to='/users'  />

      // history.push('/dashboard');  
    }).catch(
      error => {
        console.log(error.response)
        this.setState({
          error: true,
        });
        console.log(this.state.error)
      })
  }
  redirectto = () => {
    console.log('iii')
    return <Redirect to='/users' />
  }


  render() {
    let error = (this.state.error) ? <div className="alert alert-danger alert-dismissible fade in">
      <a href="#!" className="close" data-dismiss="alert" aria-label="close">&times;</a>
      <strong>Danger!</strong> Wrong Credentials please check
                      </div> : '';

    return (
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="login-logo">
            <a href="#!"><b>Admin</b>To n Fro</a>
          </div>

          <div className="login-box-body">
            <p className="login-box-msg">Sign in to start your session</p>
            {error}
            <div className="form-group has-feedback">
              <input type="email" className="form-control" placeholder="Email" ref={this.email} />
              <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
              <input type="password" className="form-control" placeholder="Password" ref={this.password} />
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <button type="submit" className="btn btn-primary btn-block btn-flat" onClick={() => this.login()}>Sign In</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Login