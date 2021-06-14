import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './assets/css/style.css';
import './assets/css/bootstrap.min.css';
import './assets/css/fontawsome.css';
import './assets/css/skin.css';
import './assets/css/ionicons.min.css';
import 'antd/dist/antd.css';

//Customer
import Customer from './components/admin/customer/Customer';
import NewCustomer from './components/admin/customer/NewCustomer';
import EditCustomer from './components/admin/customer/EditCustomer';

//Vehicle

import Vehicle from './components/admin/vehicle/Vehicle';
import NewVehicle from './components/admin/vehicle/NewVehicle';
import EditVehicle from './components/admin/vehicle/EditVehicle';

//Driver

import Driver from './components/admin/driver/Driver';
import NewDriver from './components/admin/driver/NewDriver';
import EditDriver from './components/admin/driver/EditDriver';
import Kyc from './components/admin/driver/kyc/Kyc';

//Driver

import Routes from './components/admin/Route/Routes';
import NewRoute from './components/admin/Route/NewRoute';


//Point

import Point from './components/admin/point/Point';
import NewPoint from './components/admin/point/NewPoint';

//Booking

import Booking from './components/admin/booking/Booking';
import NewBooking from './components/admin/booking/NewBooking';
import EditBooking from './components/admin/booking/EditBooking';
import Success from './components/admin/booking/Success';

//Document

import Document from './components/admin/document/Document';
import NewDocument from './components/admin/document/NewDocument';

//Services

import Service from './components/admin/service/Service';
import NewService from './components/admin/service/NewService';

 

//Passes

import JourneyTrip from './components/admin/journey_trip/JourneyTrip';
import NewJourneyTrip from './components/admin/journey_trip/NewJourneyTrip';
import EditjounrneyBooking from './components/admin/journey_trip/EditjounrneyBooking';

//Pass
import Pass from './components/admin/pass/Pass';
import NewPass from './components/admin/pass/NewPass';
import EditPass from './components/admin/pass/EditPass';
import PurchasedPass from './components/admin/pass/PurchasedPass';

//vehicleIMEI
import vehicleIMEI from './components/admin/VehicleIMEI/VehicleIMEI.js';
import NewvehicleIMEI from './components/admin/VehicleIMEI/NewVehicleIMEI.js';
import EditvehicleIMEI from './components/admin/VehicleIMEI/EditVehicleIMEI.js';

//Document

import Journey from './components/admin/journey/Journey';
import NewJourney from './components/admin/journey/NewJourney';
import EditJourney from './components/admin/journey/EditJourney';

import Dashboard from './components/admin/Dashboard';
import Login from './components/auth/Login';
import { ProtectedRoute } from "./components/auth/protected.route";

import { Route, BrowserRouter as Router } from 'react-router-dom';


require('dotenv').config()
class App extends Component {

  constructor(props) {
    super(props);
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3NTAzNDU1MDU3IiwiaWQiOjEsImlhdCI6MTU3NzU4NzkzMX0.Rz20o7tDtHUkVLBzCmAu7_kcmM_CqaTFL0s8bHuy4ag';
    // localStorage.setItem('token', token);
  }

  render() {
    return (
      <div className="App">

        {/* <Router basename="/subdirectory"> */}
        <Router>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />

          {/**/}
          <ProtectedRoute path="/dashboard" component={Dashboard} />

          <ProtectedRoute exact path="/customer" component={Customer} />
          <ProtectedRoute path="/customer/add" component={NewCustomer} />
          <ProtectedRoute path="/customer/edit/:id" component={EditCustomer} />

          <ProtectedRoute exact path="/vehicle" component={Vehicle} />
          <ProtectedRoute path="/vehicle/add" component={NewVehicle} />
          <ProtectedRoute path="/vehicle/edit/:id" component={EditVehicle} />

          <ProtectedRoute exact path="/driver" component={Driver} />
          <ProtectedRoute path="/driver/add" component={NewDriver} />
          <ProtectedRoute path="/driver/edit/:id" component={EditDriver} />
          <ProtectedRoute path="/kyc/add/:id" component={Kyc} />


          <ProtectedRoute exact path="/route" component={Routes} />
          <ProtectedRoute path="/route/add" component={NewRoute} />
          <ProtectedRoute path="/route/edit/:id" component={NewRoute} />

          <ProtectedRoute exact path="/point" component={Point} />
          <ProtectedRoute path="/point/add" component={NewPoint} />
          <ProtectedRoute path="/point/edit/:id" component={NewPoint} />

          <ProtectedRoute exact path="/booking" component={Booking} />
          <ProtectedRoute exact path="/booking/:id" component={Booking} />
          <ProtectedRoute path="/bookings/add" component={NewBooking} />
          <ProtectedRoute path="/booking/edit/:id" component={EditBooking} />
          <ProtectedRoute exact path="/bookings/success/:orderid" component={Success} />

          <ProtectedRoute exact path="/document" component={Document} />
          <ProtectedRoute path="/document/add" component={NewDocument} />
          <ProtectedRoute path="/document/edit/:id" component={NewDocument} />

          <ProtectedRoute exact path="/service" component={Service} />
          <ProtectedRoute path="/service/add" component={NewService} />
          <ProtectedRoute path="/service/edit/:id" component={NewService} />


          <ProtectedRoute exact path="/journey" component={Journey} />
          <ProtectedRoute path="/journey/add" component={NewJourney} />
          <ProtectedRoute path="/journey/edit/:id" component={EditJourney} />

           
          <ProtectedRoute exact path="/journey/bookings/add" component={NewJourneyTrip} />
          <ProtectedRoute exact path="/journey/bookings/edit/:id" component={EditjounrneyBooking} />
          <ProtectedRoute path="/journey/booking" component={JourneyTrip} />

         <ProtectedRoute exact path="/pass" component={Pass} /> 
         <ProtectedRoute path="/pass/add" component={NewPass} />
         <ProtectedRoute path="/pass/edit/:id" component={EditPass} />
         <ProtectedRoute path="/pass/purchased" component={PurchasedPass} />

         <ProtectedRoute exact path="/vehicleIMEI" component={vehicleIMEI} /> 
         <ProtectedRoute path="/vehicleIMEI/add" component={NewvehicleIMEI} />
         <ProtectedRoute path="/vehicleIMEI/edit/:id" component={EditvehicleIMEI} />
       
        </Router>
      </div>
    );
  }
}

export default App;
