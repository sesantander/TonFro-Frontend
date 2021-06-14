import React, { Component } from 'react'
// import  { Redirect } from 'react-router-dom'
// import { Route, Link, BrowserRouter,withRouter } from 'react-router-dom';
import { history } from '../../helpers/history';
import user2 from '../../assets/img/user2-160x160.jpg'
import { Icon, Menu, Dropdown } from 'antd';
import './top.css';
import {Link} from 'react-router-dom';


class Top extends Component {
  constructor(props) {
    super(props)
    
    const userinfo = JSON.parse(localStorage.getItem('userinfo'));
    this.state = {
      user: userinfo,
      open: true,
    }
    this.nav = {
      'profileMenu': false,
      'notification': false,
    };
  }
  toggleTopmenu = (state) => {
    if (state === 'profileMenu') {
      this.nav['notification'] = false;
    } else {
      this.nav['profileMenu'] = false;
    }
    this.nav[state] = !this.nav[state];

    console.log(this.nav)
  }
  logout = () => {
    localStorage.clear();
    console.log(this.props)
    history.push('/login');
    // return <Redirect to='/login'  />
    window.location.pathname = '/login';

  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="#!" className="header">You have 2 Notifications</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#!"> Text1</a>

        </Menu.Item>
        <Menu.Item key="1">
          <a href="#!"> Text1</a>


        </Menu.Item>
        <Menu.Item key="1" className="footer">
          <a href="#!"> Text1</a>

        </Menu.Item>
        <Menu.Item key="1" className="footer">
          <a href="#!"> Text1</a>

        </Menu.Item>
        <Menu.Item key="1" className="footer">
          <a href="#!"> Text1</a>

        </Menu.Item>
        <Menu.Item key="1" className="footer">
          <a href="#!"> Text1</a>

        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" className="footer">

          <a href="#!">View all</a>

        </Menu.Item>
      </Menu>
    );
    return (
      <header className="main-header">

         <Link to="/dashboard" className="logo">
          <span className="logo-mini"><b>T</b>NF</span>
          <span className="logo-lg"><b>TO</b>NFRO</span>
        </Link>

        <nav className="navbar navbar-static-top">
          <a href="#!" className="sidebar-toggle" data-toggle="push-menu" role="button" onClick={this.props.toggleBar}>
            <Icon type="pic-left" />
          </a>

          <div className="navbar-custom-menu">

            <ul className="nav navbar-nav">

               {/*<li className={this.nav['notification'] ? 'dropdown notifications-menu open' : 'dropdown notifications-menu'}>
               <Dropdown overlay={menu} trigger={['click']} overlayClassName="dropdown-menu">
                  <a className="ant-dropdown-link" href="#!">
                    <Icon type="notification" />
                  </a>
                </Dropdown>


              </li>*/}


              <li className={this.nav['profileMenu'] ? 'dropdown user user-menu open' : 'dropdown user user-menu'}>
                <a href="#!" className="dropdown-toggle" data-toggle="dropdown" onClick={() => this.toggleTopmenu('profileMenu')}>
                  <img src={user2} className="user-image" alt="User Image" />
                  <span className="hidden-xs">{(this.state.user.name)?this.state.user.name:''}</span>
                </a>
                <ul className="dropdown-menu">

                  <li className="user-header">
                    <img src={user2} className="img-circle" alt="" />
                    <p>
                      {(this.state.user.name)?this.state.user.name:''}
                  {/* <small>Member since Nov. 2020</small> */}
                    </p>
                  </li>

                  {/* <li className="user-body">
                <div className="row">
                  <div className="col-xs-4 text-center">
                    <a href="#!">Followers</a>
                  </div>
                  <div className="col-xs-4 text-center">
                    <a href="#!">Sales</a>
                  </div>
                  <div className="col-xs-4 text-center">
                    <a href="#!">Friends</a>
                  </div>
                </div>
                
              </li> */}

                  <li className="user-footer">
                    <div className="pull-left">
                      {/* <a href="#!" className="btn btn-default btn-flat">Profile</a> */}
                    </div>
                    <div className="pull-right">
                      <a onClick={this.logout} className="btn btn-default btn-flat">Sign out</a>
                    </div>
                  </li>
                </ul>
              </li>
              {/* <li><a href="#!"><i className="fa fa-gears"></i></a></li> */}

            </ul>
          </div>
        </nav>
      </header>
    )
  }

}
export default Top