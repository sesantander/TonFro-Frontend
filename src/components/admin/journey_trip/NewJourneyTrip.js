import React, { Component } from 'react'
import route from '../../../services/route';
import point from '../../../services/point';
import vehicle from '../../../services/vehicle';
import trip from '../../../services/trip';
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
class NewJourneyTrip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'form': {
        "date": moment(new Date(), 'YYYY/MM/DD').format('MM/DD/YYYY'),
        "tripId": '',
        "isActive": '',
        "maxSeat": '',
        'attr1': '',
        'attr2': ''
      },
      'date':moment(new Date(), 'YYYY/MM/DD'),
      'required': {
        "date": false,
        "tripId": false,
        "isActive": false
      },
      'trips': [],
      'bookingId': '',
      loading: false,

    };
    const format = 'MM/DD/YYYY';
    this.heading = 'Add Booking';
    this.requiredText = ["maxSeat", "isActive", "tripId"];
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
        'bookingId': params.id,
        'heading': 'Edit Heading'
      })
      this.get(params.id);
      this.heading = 'Edit Booking'

    } else {

    }
    this.getTrips();

  }
  get = (id) => {
    trip.getBooking(id).then(res => {
      console.log(res);
      let form = this.state.form;
      let data = res.data;
      if (data.status) {
        data = data.data;
        console.log(data);
        form['tripId'] = data.id;
        form['maxSeat'] = data.maxSeat;
        form['vehicleId'] = data.vehicleId;
        form['routeId'] = data.routeId;

        form['startingPoint'] = (data.startingPoint) ? data.startingPoint.id : '';
        form['destinationPoint'] = (data.startingPoint) ? data.destinationPoint.id : '';
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
          form,
          date: moment(data.date, 'YYYY/MM/DD')
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
    var formatted = moment(open, this.format).format('MM/DD/YYYY');
    const form = this.state.form;
    form['date'] = formatted;

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
  handleSourceChange = selectedOption => {
    console.log(selectedOption)
    const form = this.state['form'];
    form['startingPoint'] = selectedOption.value;
    this.setState({ 'source': selectedOption });
    this.setState({ 'form': form });
  };

  handleRouteChange = selectedOption => {
    console.log(selectedOption)
    let form = this.state['form'];
    let required = this.state['required'];
    form['tripId'] = selectedOption;
    required["tripId"] = false;
    // this.setState({ 'route': selectedOption });
    this.setState({ 'form': form,required:required });
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
    if (validate) {
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
     let form = this.state.form;
    form['maxSeat'] = parseInt( form['maxSeat'] )
    trip.addbooking(this.state.form).then(res => {
      let data = res.data;
      this.setState({
        'loading': false
      });
      if (data.status) {
        notification.success('Record Added');
      } else {
        notification.error(data.statusMessage)

      }

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }
  update = () => {
    let form = this.state.form;
    form['bookingId'] = this.state.bookingId;
    trip.updatebooking(form).then(res => {
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
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/journey"
                data-toggle="tooltip"
                title="Journey"
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
                    <h3 className="box-title">{this.heading}</h3>
                  </div>
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-6">
                        <InputComponent
                          propValues={{
                            label: 'Max Seat',
                            required: this.state["required"].maxSeat,
                            value: this.state["form"].maxSeat,
                            onChange: this.handleUserInput.bind(this),
                            name: 'maxSeat',
                            isRequired: true

                          }} />

                      </div>
                      <div className="col-md-6">

                        <label className="control-label">Date</label>
                        <div className={
                          this.state["required"]["startTime"]
                            ? "form-group has-error"
                            : "form-group"
                        }>


                          <DatePicker format={this.format} value={this.state.date} onChange={this.handleOpenChange} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">

                        <div className={
                          this.state["required"]["tripId"]
                            ? "form-group has-error"
                            : "form-group"
                        }>
                          <label className="control-label">Journey</label>
                          <Srelect className="full-width" name="destination" value={this.state.form['tripId']} onChange={(e) => this.handleRouteChange(e)} showSearch filterOption={(input, option) =>
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
                          this.state["required"]["isActive"]
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