import React, { Component } from 'react'
import route from '../../../services/route';
import point from '../../../services/point';
import vehicle from '../../../services/vehicle';
import trip from '../../../services/trip';
import booking from '../../../services/booking';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import { InputNumber,TimePicker,Button, Input,Select as Srelect, DatePicker } from 'antd';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
import NumberPicker from 'react-widgets/lib/NumberPicker'
import Success from './Success'
// import PointComponent from '../PointComponent';
import moment from 'moment';
import { getOverflowOptions } from 'antd/lib/tooltip/placements';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}



class NewJourneyTrip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
      'form': {
        //travelDate:moment(new Date(), 'YYYY/MM/DD'),
        travelDate:"",
        tripId: '',
        isActive: '',
        seatCount: '',
        from: '',
        to:'',
        price:'',
        seatsavailable:'',
        pickupTime:'',
        Bymobile :JSON.parse(localStorage.getItem('userinfo')).mobile,
        Byname:JSON.parse(localStorage.getItem('userinfo')).name,
        mobileBookedFor :'',
        nameBookedFor :'',
        orderid:'',
        isBookingForOther : true,
        approved:"",
        paymentMethod:""
        
      },
      paymentMethod:"",
     
      trips:[],
      points:[],
      'date':"",
      'required': {
        date: '',
        tripId: '',
        
        from: '',
        to:'',
        travelDate:'',
      
      },
      Fromname:'',
      Toname:"",
      Routename:"",
      'from':'',
      'to':'',
      'trips': [],
      'bookingId': '',
      loading: false,

    };
    const format = 'YYYY-MM-DD';
    this.requiredText = ['date', 'tripId','from','to',"travelDate"];
    this.options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];
  }
  addMorePoint = () => {
    const journey_points = this.state.journey_points;
    const journey_time = this.state.journey_time;
    const rpoint = this.state.rpoint;

    journey_points.push({
      'id': '',
      'time': '12:08',
    });
    rpoint.push({ value: '', label: '' });
    journey_time.push({
      'time': moment('12:08', 'HH:mm')
    });
    this.setState({
      journey_points: journey_points,
      rpoint: rpoint,
      journey_time: journey_time
    })
  }

  modalInsertar=()=>{
    this.setState({modalInsertar:!this.state.modalInsertar });
     
   }

  handlePointSourceChange = (selectedOption, index) => {
    const journey_points = this.state.journey_points;
    const rpoint = this.state.rpoint;
    journey_points[index].id = selectedOption.value;
    rpoint[index] = selectedOption;
    this.setState({ 'journey_points': journey_points, rpoint: rpoint, });
  }
  handleRoutePointInput = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    const journey_points = this.state.journey_points;
    journey_points[index][name] = value;
    this.setState({ 'journey_points': journey_points });
  }
  componentDidMount() {
    let params = this.props.match.params;
    console.log(params)
    if (typeof params.id !== 'undefined') {

      this.setState({
        'bookingId': params.id
      })
      this.get(params.id);
      
    } else {

    }
    this.getTrips();
    this.getRoutes();
    this.getPoints();
    
  }
  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      startingPointId: value
    })
  }

  handledestinationChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      endPointId: value
    })
  }

  handleNumberInput(name,value) {
    const state = this.state.form;
   
    state[name] = value;
    console.log(this.state.form);
    this.setState({ form: state });

    this.checkif();
  } 
  getRoutes = () => {
    route.list().then(res => {
     // console.log(res)
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          routes: list,

        });
      }
    })
  }
  getPoints = (tripid) => {
    point.list(tripid).then(res => {
      console.log(res.data,"AJAAAAAAAAAAAA")
      let data = res.data;
     
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          points: list,

        });
      }
    })
  }
  get = (id) => {
    trip.get(id).then(res => {
      console.log(res);
      let form = this.state.form;
      let data = res.data;
      if (data.status) {
        data = data.data;
        console.log(data);
        // form['tripId'] = data.id;
        form['seatCount'] = data.seatCount;
        form['from'] = data.from;
        form['to'] = data.to;
        form['price'] = data.price;
        // form['startingPoint'] = (data.startingPoint) ? data.startingPoint.id : '';
        // form['destinationPoint'] = (data.startingPoint) ? data.destinationPoint.id : '';
        form['isActive'] = (data.isActive) ? 1 : 0;

        this.setState({
          'tripId': data.id,
          'source': {
            'label': (data.startingPoint) ? data.startingPoint.name : '',
            'value': (data.startingPoint) ? data.startingPoint.id : '',
          },
          'destination': {
            'label': (data.destinationPoint) ? data.destinationPoint.name : '',
            'value': (data.destinationPoint) ? data.destinationPoint.id : '',
          },

          'time': moment(data.startTime, 'HH:mm')
        })
        this.setState({
          form
        });
      }else{
      //  notification.error('')
      }
    });
  }

  getTrips() {
    trip.list().then(res => {
      let data = res.data;
       if(data.status){
      let list = data.data;
      console.log(list);
      this.setState({
        trips: list,
      });
}
    });
  }

  handlestatusChange(value) {
    let form = this.state["form"];
    form["paymentMethod"] = value;
    this.setState({
      form: form
    });
    this.setState({
      paymentMethod: value
    });
  }

  setupSelect(list) {
    list.forEach(function (row) {
      row['value'] = row.id;
      row['label'] = row.name;
    });
    return list
  }
  handleOpenChange = open => {
    var formatted = moment(open, this.format).format('MM/DD/YYYY');
    console.log(formatted)
    console.log(open)

    const form = this.state.form;
    form['travelDate'] = formatted;

    this.setState({
      form: form,
      'date': open
     
    })

    this.checkif();

  };
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required'])
    
    
    // console.log(updatedValue)
    this.setState({ 'form': updatedValue.form, 'required': updatedValue.required });
  }

  handleMobile(e) {
    const re = /^[0-9\b]+$/;
    const name = e.target.name;

   
    if (e.target.value === '' || re.test(e.target.value)) {
     
      const form = this.state["form"];
      form[name]=   e.target.value;
      console.log(form)
      this.setState({ form: form });
    }

    
   

  
  }
  handleFromChange = selectedOption => {

    
   var  array=this.state.points;
    array.map(point=> 
      {
        
        if (point.pointId==selectedOption) {
          this.setState({
            Fromname:point.point.name
        
          });
        }
      }
      );
    


    const form = this.state['form'];
    form['from'] = selectedOption;
    
    this.setState({ 'form': form });

    this.checkif();

  };

  handleToChange = selectedOption => {
   
   
   var  array=this.state.points;
    array.map(point=> 
      {
        
        if (point.pointId==selectedOption) {
          this.setState({
            Toname:point.point.name
        
          });
        }
      }
      );
    


    const form = this.state['form'];
    form['to'] = selectedOption;
    
    this.setState({ 'form': form });

    this.checkif();
   
      
     
    

  };
  handleRouteChange = (selectedOption,e) => {
    console.log(selectedOption)
    const form = this.state['form'];
    form['tripId'] = selectedOption;
    // this.setState({ 'route': selectedOption });
    this.setState({ 'form': form });



    var  array=this.state.trips;
    array.map(trip=> 
      {
        console.log("trips",trip)
        if (trip.id==selectedOption) {
          this.setState({
               Routename:trip.name
          });
        }
      }
      );

    this.checkif();
   
    const form2 = this.state['form'];
    form['from'] = "";
    form['to'] = "";
    
    this.setState({ 
      'form': form2,
       Fromname:"",
      Toname:"",
   });
      
      this.getPoints(selectedOption);
    
       
      
     
      
    


  };

  handleSubmit = (event) => {
    event.preventDefault();
   
    let req = this.state.required;

    let validate = true;
    this.requiredText.forEach((v) => {
      if (this.state['form'][v] === '') {
        req[v] = true;
        validate = false;
        this.setState({
          'required': req
        });
      }
    });
    console.log(this.state.tripId)
    if (validate) {
      console.log(this.state)
      this.setState({
        'loading': true,

      });
      if (this.state.bookingId !== '') {
        this.update()
      } else {
        this.add();
      }
    }else{

      this.setState({
        'loading': false
      });
    }
  }

  add = () => {
    booking.add(this.state.form).then(res => {
      console.log(res);
      let data = res.data;
    
      console.log("DATAAA NOJODA",data)
      if (data.status) {
          
      this.setState({
        'loading': false,
        orderid:data.id
      });
      var inv={
        orderid:data.data.id,
        currency:data.data.currency,
        amount:data.data.amount
      }
     
       
        this.displayRazorpay(inv)
      } else {
        notification.error(data.statusMessage)
        this.setState({
          'loading': false
        });
      }

    }, error => {
      console.log(error)
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }

  

 
  update = () => {
    let form = this.state.form;
    form['bookingId'] = this.state.bookingId;
    booking.updatebooking(form).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      notification.success('Record Updated');

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }

  reset =()=>{
    const form = this.state['form'];
    form['travelDate'] = "";
    form['tripId'] = "";
    form['seatCount'] = "";
    form['from'] = "";
    form['to'] = "";
    form['mobileBookedFor'] = "";
    form['nameBookedFor'] = "";
  
 
    this.setState({ 
      'form': form,
      "date":"",
      Fromname:"",
      Toname:"",
      Routename:""
  });
    
  
   
  }

  
 
  displayRazorpay = async (data) => {
 
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load')
			return
		}

   
		const options = {
			key: "rzp_test_0BHVYQoVWSZpst",
			currency: data.currency,
			amount: data.amount,
			order_id: data.orderid,

			name: 'Created order',
			description: 'Thanks',
			image: 'https://example.com/your_logo',
			handler: function (response) {
            if (response) {
             

                
                if (typeof response.razorpay_payment_id == 'undefined' ||  response.razorpay_payment_id < 1) {
                    
                    alert('/you-owe-money.html');
                } else {
                  
                    window.location = '/bookings/success/'+data.orderid;
                }

            }

       
			},
			prefill: {
				name:this.state["form"].nameBookedFor,
				email: 'youremailhere@example.com',
				contact: this.state["form"].mobileBookedFor
			},
            notes: {
                type: 'booking'
            }
		}
    const paymentObject = new window.Razorpay(options)
   
   
   
    paymentObject.open()
    
    
	}


  checkif = () => {
    console.log("entro")
    console.log("mientas",this.state["form"].travelDate)
    
    if (this.state["form"].travelDate=="Invalid date") {
      const form = this.state['form'];
        
        form['pickupTime'] = "";
        form['seatsavailable'] = "";
        form['price'] = "";
        this.setState({
          'form': form,

        })
      
    }
   if (this.state["form"].tripId!="" && this.state["form"].from!="" && this.state["form"].to!="" &&  this.state["form"].travelDate!=""  &&this.state["form"].travelDate!="Invalid date" && this.state["form"].seatCount!="" ) {
     

      
      const con={
        from:this.state["form"].from,
        to:this.state["form"].to,
        tripId:this.state["form"].tripId,
        travelDate:this.state["form"].travelDate,
        seatCount:this.state["form"].seatCount
      }
      
      // booking.getRoutePriceSeat(con).then(res => {
      //   console.log("respuesta",res);
      //   let data = res.data;
      //   console.log(data)
        
        
    
      

        // if (data.status) {
          const form = this.state['form'];
        // form['pickupTime'] =data.data.pickupTime;
        // form['seatsavailable'] = data.data.seatsavailable;
        // form['price'] = data.data.price;
        form['pickupTime'] ="10:47:22";
        form['seatsavailable'] = 25;
        form['price'] = 500;
        
          this.setState({
            'form': form,

          })
        // } else {
        //   notification.error(data.statusMessage)

        // }

      // }, error => {
      //   console.log(error)
      //   this.setState({
      //     'loading': false
      //   });
      //   notification.error('Api error')
      // })

    }
  }

   disabledDate(current) {
    
    return current && current < moment().startOf('day');
  }
 


  render() {
    const { Option } = Srelect;
    
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Add Booking</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/booking"
                data-toggle="tooltip"
                title="Add Journey"
              >
                <i className="fa fa-long-arrow-left"></i>Back
                  </Link>
            </div>
          </div>
        </section>
        <section className="content">
          <Tabs defaultTab="one"
            onChange={(tabId) => { console.log(tabId) }}
          >

            <TabPanel tabId="one">
              <form onSubmit={this.handleSubmit}>
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Journey</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      
                    
                    <div className="col-md-6">
                      <InputComponent
                          propValues={{
                            label: 'Booked by (Mobile)',
                            value: this.state["form"].Bymobile,
                            onChange: this.handleUserInput.bind(this),
                            name: 'Bymobile',
                          
                          }} />
                      </div>
                      

                      <div className="col-md-6">
                      <InputComponent
                          propValues={{
                            label: 'Booked by (UserName)',
                            value: this.state["form"].Byname,
                            onChange: this.handleUserInput.bind(this),
                            name: 'Byname',
                           

                          }} />
                      </div>

                      </div>

                      <div className="row">
                      
                      <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">
                        For (Mobile)
                      </label>
                      <input
                        type="text"
                        name="mobileBookedFor"
                        value={this.state["form"].mobileBookedFor}
                        id="For (Mobile)"
                        className={
                          this.state.mobileBookedFor
                            ? "form-control"
                            : "form-control"
                        }
                        autoComplete="off"
                        maxLength="10"
                        placeholder="For (Mobile)"
                        onChange={e => this.handleMobile(e)}
                      />
                     
                    </div>
                    
                  </div>
                      

                      <div className="col-md-6">
                      <InputComponent
                          propValues={{
                            label: 'For (Name)',
                            
                            value: this.state["form"].nameBookedFor,
                            onChange: this.handleUserInput.bind(this),
                            name: 'nameBookedFor',
                            
                          }} />
                      </div>

                      </div>


                      <div className="row">
                      
                      <div className="col-md-6">
                      <div className={
                          this.state["required"]["tripId"]
                            ? "form-group has-error"
                            : "form-group required"
                        }>
                      <label className="control-label">Journey Choose</label>
                      <Srelect className="full-width" name="tripId" value={this.state.form['tripId']} onChange={(e) => this.handleRouteChange(e)} showSearch filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                            {
                              this.state.trips.map(val => {
                                return (
                                  <Option key={val.id} value={val.id}>{val.name}</Option>
                                )
                              })
                            }
                          </Srelect>
                         </div>
                         
                      </div>

                      <div className="col-md-6">
                        <div className={
                          this.state["required"]["from"]
                            ? "form-group has-error"
                            : "form-group required"
                        }>
                          <label className="control-label">Start Point(From)</label>
                          <Srelect className="full-width" name="from" value={this.state.form['from']} onChange={(e) => this.handleFromChange(e)} showSearch filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                            {
                              this.state.points.map(val => {
                                return (
                                  <Option key={val.id} value={val.id}>{val.name}</Option>
                                )
                              })
                            }
                          </Srelect>
                        </div>
                      </div>
                      
                    
                    

                    </div>
                    <div className="row">
                        
                        
                      
                    <div className="col-md-6">

                        <div className={
                          this.state["required"]["to"]
                            ? "form-group has-error"
                            : "form-group required"
                        }>
                          <label className="control-label">End Point(To)</label>
                          <Srelect className="full-width" name="End Point(To)" value={this.state.form['to']} onChange={(e) => this.handleToChange(e)} showSearch filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                            {
                              this.state.points.map(val => {
                                return (
                                  <Option key={val.id} value={val.id}>{val.name}</Option>
                                )
                              })
                            }
                          </Srelect>
                        </div>
                        </div>




                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="control-label">
                          Journey Time
                          </label>
                          <Input  placeholder={this.state["form"].pickupTime} disabled />
                        
                        </div>
                      
                    </div>
                     
                    </div>

                            


                    <div className="row">
                    
                    <div className="col-md-6">
                      <div className={
                          this.state["required"]["travelDate"]
                            ? "form-group has-error"
                            : "form-group required"
                        }>
                        <label className="control-label">Route Date</label>
                          <DatePicker format={this.format} disabledDate={this.disabledDate} value={this.state.date} onChange={this.handleOpenChange} />
                      </div>
                    </div>



                    <div className="col-md-6">
                        <div className="form-group">
                          <label className="control-label">
                          Price
                          </label>
                          <Input  placeholder={this.state["form"].price} disabled />
                        
                        </div>
                      
                    </div>



                     
                    </div>
                   


                    <div className="row">
                    
                    <div className="col-md-6">
                        <div className="form-group">
                          <label className="control-label">
                          Seats Available
                          </label>
                          <Input  placeholder={this.state["form"].seatsavailable} disabled />
                        
                        </div>
                      
                    </div>

                          <div className="col-md-6">
                          <label className="colPer2" >No. of Seats Required</label>
                          <div className="form-group required" >
                          
                          <div className="colPer">
                      
                          <NumberPicker
                              name="seatCount"
                              value={this.state["form"].seatCount}
                              onChange= {value => this.handleNumberInput("seatCount",value)}                       
                              min={1}
                              
                            />
                          </div>
                          </div>
                          </div>


                          
                    </div>

                    <div className="row">

                </div>


                
                    <div align="right">
                    
                    </div>
                    

                    <div className="row">
                    
                     <div className="col-md-6">
                       <h3 align="left">View Summary</h3>
                          
                      </div>
                         
                   

                 
                    </div>
                          
                          
                          <div align="left">Booked By (Mobile): {this.state["form"].Bymobile}</div>
                          <div align="left">Booked By (Username): {this.state["form"].Byname}</div>
                          <div align="left">For (Mobile): {this.state["form"].mobileBookedFor}</div>
                          <div align="left">For (Name): {this.state["form"].nameBookedFor}</div>
                          <div align="left">Route Choose: {this.state.Routename}</div>
                          <div align="left">Start Point: {this.state.Fromname}</div>
                          <div align="left">End Point: {this.state.Toname}</div>
                       
                          <div align="left">Route date: {this.state["form"].travelDate}</div>
                          <div align="left">Seats Required: {this.state["form"].seatCount}</div>
                          <div align="left">Price: {this.state["form"].price}</div>
                          <div align="left">Route Time: {this.state["form"].pickupTime}</div>
                          <div align="left">Seats Available: {this.state["form"].seatsavailable}</div>
                          
                          
                   
                  </div>
                  
                  <div>
                  
               
               
            
                  </div>

                          
                         
                  <ActionComponent loading={this.state.loading} clearForm={this.clearForm}></ActionComponent>

                </div>
                
              </form>

              
            </TabPanel>

          </Tabs>

        </section>
      </>

    )
  }
}
export default NewJourneyTrip