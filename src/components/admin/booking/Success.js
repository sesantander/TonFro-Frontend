import React, { Component } from "react";

import { Button, } from "antd";
import ActionComponent from "../ActionComponent";
import InputComponent from "../InputComponent";
import BackComponent from "../BackComponent";
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import '../../../assets/css/newSelect.css';
import check from './check.png'; 
import booking from '../../../services/booking';
class Success extends Component {
  constructor(props) {
    super(props);

    this.state = {
      price: "",
      seatsBooked: "",
      nameBookedFor:"",
      mobileBookedFor:"",
      rideStatus:"",
      sourcepoint: "",
      destinationpoint:"",
      tripname:"",
      traveldate: "",
      orderId:"",
      pickupTime:""
      
      

    };
  }
  
  componentDidMount() {
    
  
    this.get(this.props.match.params.orderid)
  }
 
  get=(orderid)=>{
    var v={
      orderId:orderid
    }
    booking.getBooking(v).then(res => {
      console.log('lit killah',res.data.data.bookingData);
      let f=res.data.data.bookingData;
      this.setState ( {
        price: f.price,
        seatsBooked: f.seatsBooked,
        nameBookedFor:f.nameBookedFor,
        rideStatus:f.rideStatus,
        sourcepoint: f.sourcePoint.name,
        destinationpoint:f.destinationPoint.name,
        tripname:f.trip.name,
        traveldate: f.travelDate,
        orderId:f.orderId,
        pickupTime:f.pickupTime,
        mobileBookedFor:f.mobileBookedFor
        
        
  
      });
     

    }, error => {
      
      notification.error('Api error')
    })

  }
  redirecttobookings = () => {


  }

redirecttobookings = () => {

window.location="/booking"
}
redirecttoaddbooking = () => {
window.location="/bookings/add"
}

render(){

    
      return (
        <>
          <section className="content-header">
            <ToastContainer />
  
            <div className="bg-light lter b-b wrapper-md clearfix">
              <div className="pull-left">
               
              </div>
              <div className="pull-rigth">
                <BackComponent back="/booking"></BackComponent>
              </div>
            </div>
          </section>
          <section className="content">
           
              <div className="box">
                <div className="box-header with-border">
                
                  <div className="pull-rigth"></div>
                </div>
  
                <div className="box-body"> 
                  
                     
                  
                   
                    
  
                    <div className="col-md-6">
                    <h3>Successful payment</h3>

                    <img src={check} width="500" height="500" />
                   
                   
                   
                      </div>
                     
                      <div className="col-md-6" >
                     
                          <h3>Booking Details</h3>
                          
                          <div align="left">Order ID: {this.state.orderId}</div>
                          <div align="left">For (Mobile): {this.state.mobileBookedFor}</div>
                          <div align="left">For (Name): {this.state.nameBookedFor}</div>
                          <div align="left">Trip Name: {this.state.tripname}</div>
                          <div align="left">Start Point: {this.state.sourcepoint}</div>
                          <div align="left">End Point: {this.state.destinationpoint}</div>
                       
                          <div align="left">Route date: {this.state.traveldate}</div>
                          <div align="left">Seats Booked: {this.state.seatsBooked}</div>
                          <div align="left">Price: {this.state.price}</div>
                          <div align="left">Route Time: {this.state.pickupTime}</div>
                        
                          
                          <Button type="primary"onClick={this.redirecttobookings}>
                        Back to Bookings
                     
                      </Button>
                     
                      &nbsp;
                      &nbsp;
                      &nbsp;
                      &nbsp;
                      &nbsp;
                      
                      <Button type="primary" onClick={this.redirecttoaddbooking}>
                        Continue adding bookings
                      </Button>
       
                  
                     </div>
                     
                 
                      
               
                </div>
                
              </div>
           
          </section>
        </>
      );
      }
    
}

 
   
export default Success;
