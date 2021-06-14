import React,{Component} from 'react'
import Top from '../common/Top';
import Header from '../common/Header';
import ErrorHandler from './ErrorHandler';

// import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
// import { Redirect } from 'react-router'

class Admin extends Component{
    constructor(props){
    	super(props)
    	this.state = {
    		open : true
    	}
    }
    toggleSidebar = () =>{
    	if(this.state.open){
            this.setState({
            	open:false
            });
        }else{
            this.setState({
            	open:true
            });
        }
        console.log('trt');
    }
	render(){
		if (window.location.pathname === '/login'){
			return (<>{this.props.children}</>)
		}else{
			return (
            <div className={!this.state.open?'wrapper sidebar-open sidebar-mini sidebar-collapse':'wrapper'}>
                
                <Top toggleBar={this.toggleSidebar} history={this.props.history}>
    		    </Top>
                <Header isOpen={this.state.open}>
                </Header>
    		    <div className="content-wrapper" style={{minHeight:'986px'}}>
                
                 
    		    {this.props.children}
				 
                
                </div>
             </div>)
		}
	}
}
export default Admin