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
import { TimePicker, Select as Srelect, DatePicker } from 'antd';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
// import PointComponent from '../PointComponent';
import moment from 'moment';
class EditjounrneyBooking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'form': {
        // travelDate: '',
        // tripId: '',
        isActive: '',
        seatCount: '',
        from: '',
        to:'',
        price:'',
        'attr1': '',
        'attr2': ''
      },
      routes:[],
      'date': null,
      'required': {
        date: false,
        tripId: false,
      },
      'from':'',
      'to':'',
      'trips': [],
      'bookingId': '',
      loading: false,

    };
    const format = 'DD/MM/YYYY';
    this.requiredText = ['seatCount', 'from','to','price'];
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
        'trips': list,
      });
}
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
    var formatted = moment(open, this.format).format('DD/MM/YYYY');
    console.log(formatted)
    console.log(open)

    const form = this.state.form;
    form['travelDate'] = formatted;

    this.setState({
      form: form,
      'date': open
    })

  };
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required'])
    // console.log(updatedValue)
    this.setState({ 'form': updatedValue.form, 'required': updatedValue.required });
  }
  handleFromChange = selectedOption => {
   
    console.log(selectedOption)
    const form = this.state['form'];
    form['from'] = selectedOption;
    // this.setState({ 'route': selectedOption });
    this.setState({ 'form': form });
  };

  handleToChange = selectedOption => {
   
    console.log(selectedOption)
    const form = this.state['form'];
    form['to'] = selectedOption;
    // this.setState({ 'route': selectedOption });
    this.setState({ 'form': form });
  };
  handleRouteChange = (selectedOption,e) => {
    console.log(selectedOption)
    const form = this.state['form'];
    form['tripId'] = selectedOption;
    // this.setState({ 'route': selectedOption });
    this.setState({ 'form': form });
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
    }
  }

  add = () => {
    booking.add(this.state.form).then(res => {
      console.log(res);
      let data = res.data;
      console.log(data)
      this.setState({
        'loading': false
      });
      if (data.status) {
        notification.success('Record Added');
      } else {
        notification.error(data.statusMessage)

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

  render() {
    const { Option } = Srelect;

    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Edit Booking</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/booking"
                data-toggle="tooltip"
                title="Add Booking"
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
                            label: 'Seat Count',
                            required: this.state["required"].seatCount,
                            value: this.state["form"].seatCount,
                            onChange: this.handleUserInput.bind(this),
                            name: 'seatCount',
                            isRequired: true

                          }} />

                      </div>
                      <div className="col-md-6">
                            <div className={
                            this.state["required"]["tripId"]
                                ? "form-group has-error"
                                : "form-group"
                            }>

                            <InputComponent
                            propValues={{
                                label: 'Price',
                                required: this.state["required"].price,
                                value: this.state["form"].price,
                                onChange: this.handleUserInput.bind(this),
                                name: 'price',
                                isRequired: true

                            }} />

                            </div>
                            </div>

                      {/* <div className="col-md-6">
                      <div className={
                          this.state["required"]["travelDate"]
                            ? "form-group has-error"
                            : "form-group"
                        }>
                        <label className="control-label">Date</label>
                          <DatePicker format={this.format} value={this.state.date} onChange={this.handleOpenChange} />
                      </div>
                    </div> */}
                    </div>
                    <div className="row">
                      {/* <div className="col-md-6">
                        <div className={
                          this.state["required"]["tripId"]
                            ? "form-group has-error"
                            : "form-group"
                        }>
                          <label className="control-label">Journey</label>
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
                      </div> */}
                      <div className="col-md-6">
                      <div className={
                          this.state["required"]["from"]
                            ? "form-group has-error"
                            : "form-group"
                        }>
                      <label className="control-label">From</label>
                      <Srelect className="full-width" name="point_from" value={this.state.form['from']} onChange={(e) => this.handleFromChange(e)} showSearch filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }>
                            {
                              this.state.routes.map(val => {
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
                            this.state["required"]["to"]
                                ? "form-group has-error"
                                : "form-group"
                            }>
                            <label className="control-label">To</label>
                            <Srelect className="full-width" name="point_from" value={this.state.form['to']} onChange={(e) => this.handleToChange(e)} showSearch filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {
                                this.state.routes.map(val => {
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
                          this.state["required"]["status"]
                            ? "form-group has-error"
                            : "form-group"
                        } >
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
                    </div>
                    <div className="row">
                     
                    </div>
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
export default EditjounrneyBooking