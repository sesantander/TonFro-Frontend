import React,{Component} from 'react'
import AdminLTELogo from '../../assets/img/AdminLTELogo.png'
// import { Redirect } from 'react-router'
import {Link} from 'react-router-dom';

// import adminlte from '../../assets/js/adminlte.min.js'
class Header extends Component{
  
  constructor(props){
   super(props)
   this.state = {
      sidebarOpen: true
    };
    console.log(props);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.nav = {
                'users':false,
                'task':false,
                'layout':false,
              };
    this.testVarible= "this is a test";
   }
   toggleSideMenue = (state) => {
    this.nav[state] = !this.nav[state];
    console.log(this.nav)
   }
    onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
	render(){
		return (
  
     
  <aside className="main-sidebar">
    <section className="sidebar">
      <div className="user-panel">
        <div className="pull-left image">
          <img src={AdminLTELogo} className="img-circle" alt=""/>
        </div>
        <div className="pull-left info">
          <p>Administrator</p>
          <a href="#!"><i className="fa fa-circle text-success"></i> Online</a>
        </div>
      </div>

      
      <ul className="sidebar-menu" data-widget="tree">
        <li style={{height: 'auto'}} className={this.nav['users']?'treeview menu-open':'treeview'} onClick={()=>this.toggleSideMenue('users')}>
          <Link to="/dashboard">
            <i className="fa fa-dashboard"></i> <span>Dashboard</span>
             
          </Link>
           
        </li>
         
        <li><Link to="/customer"><i className="fa fa-user-plus"></i><span>Customer</span></Link></li>
        <li><Link to="/vehicle"><i className="fa fa-taxi"></i><span>Vehicles</span></Link></li>
        <li><Link to="/vehicleIMEI"><i className="fa fa-taxi"></i><span>Vehicle IMEI</span></Link></li>
        <li><Link to="/driver"><i className="fa fa-user-secret"></i><span>Drivers</span></Link></li>
        <li><Link to="/route"><i className="fa fa-list-ul"></i><span>Routes</span></Link></li>
        <li><Link to="/booking"><i className="fa  fa-file-text-o"></i><span>Bookings</span></Link></li>
        <li><Link to="/journey"><i className="fa  fa-file-text-o"></i><span>Journey</span></Link></li>

        <li className="header">Catalog</li>
        {/* <li><Link to="/document"><i className="fa fa-briefcase"></i><span>Document List</span></Link></li> */}
        <li><Link to="/point"><i className="fa fa-map-marker"></i><span>Point List</span></Link></li>
        <li><Link to="/service"><i className="fa fa-windows"></i><span>Services</span></Link></li>
        <li><Link to="/pass"><i className="fa fa-windows"></i><span>Passes</span></Link></li>
        {//<li><Link to="/pass" style={{ pointerEvents: 'none' }}><i className="fa fa-compass"></i><span>Passes</span></Link></li>}
        }
        {/* <li><Link to="/"><i className="fa fa-bolt"></i><span>SOS</span></Link></li> */}
        {/* <li><Link to="/"><i className="fa fa-bolt"></i><span>App Version</span></Link></li> */}
        {/* <li><Link to="/"><i className="fa fa-bolt"></i><span>Export Booking</span></Link></li> */}

        <li className="header">System User</li>
        
          
      </ul>
    </section>
  </aside>
			)
	}

}
export default Header