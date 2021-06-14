import React, { Component } from 'react';
import route from '../../../services/route';
import point from '../../../services/point';
import vehicle from '../../../services/vehicle';
import trip from '../../../services/trip';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import { TimePicker, Select as Srelect } from 'antd';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
// import PointComponent from '../PointComponent';
import moment from 'moment';
class EditJourney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        vehicleId: '',
        startTime: '',
        tripId: '',
        isActive: '',
        attr1: '',
        attr2: '',
        name: '',
      },
      required: {
        title: false,
        status: false,
      },
      name: '',
      source: {},
      selectedImage: [{ tripId: '', pointId: [], imageIds: [] }],
      destination: {},
      pointImages: [[]],
      routes: [],
      delImage: [],
      points: [],
      time: moment(new Date(), 'HH:mm:ss'),
      journey_points: [
        {
          id: '',
          time: moment(new Date(), 'HH:mm:ss').format('HH:mm:ss'),
        },
      ],
      journey_time: [{ time: moment(new Date(), 'HH:mm:ss') }],
      rpoint: [{ value: '', label: '' }],
      loading: false,
      ploading: false,
      tripId: '',
    };
    this.apiurl = process.env.REACT_APP_BASE_URL;
    this.requiredText = ['vehicleId', 'isActive'];
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
      pointId: '',
      time: moment(new Date(), 'HH:mm:ss').format('HH:mm:ss'),
    });
    rpoint.push({ value: '', label: '' });
    journey_time.push({
      time: moment(new Date(), 'HH:mm:ss'),
    });
    const { pointImages } = this.state;
    const { selectedImage } = this.state;
    pointImages.push([]);
    selectedImage.push({ tripId: '', pointId: [], imageIds: [] });
    this.setState({
      journey_points: journey_points,
      rpoint: rpoint,
      journey_time: journey_time,
      pointImages: pointImages,
      selectedImage: selectedImage,
    });
  };

  handlePointSourceChange = (selectedOption, index) => {
    const journey_points = this.state.journey_points;
    // const rpoint = this.state.rpoint;
    journey_points[index].pointId = selectedOption;
    // rpoint[index] = selectedOption;
    this.setState({ journey_points: journey_points });
    this.fetchPointImage(selectedOption, index);
  };
  handleRoutePointInput = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    const journey_points = this.state.journey_points;
    journey_points[index][name] = value;
    this.setState({ journey_points: journey_points });
  };
  clearForm = () => {
    this.setState({
      form: {
        name: '',
        vehicleId: '',
        startTime: '',
        tripId: '',
        isActive: '',
        startingPointId: '',
        destinationPointId: '',
        maxSeat: '',
        attr1: '',
        attr2: '',
      },
    });
  };
  componentDidMount() {
    let params = this.props.match.params;
    console.log(params);
    this.getPoints();
    if (typeof params.id !== 'undefined') {
      this.setState({
        tripId: params.id,
      });
      // this.getPoints();
      // this.getRoutePoints({'routeId':params.id});
      this.getTripPoints(params.id);
      this.get(params.id);
    } else {
      this.getVehicles();
    }
    this.getRoutes();
  }
  getTripPoints(params) {
    trip.getPoint(params).then((res) => {
      const data = res.data;
      if (data.data) {
        const point = data.data;
        const journey_points = [];
        const journey_time = [];
        const rpoint = [];
        point.forEach((row) => {
          journey_points.push({
            id: row.id,
            pointId: row.pointId,
            time: moment(row.time, 'HH:mm:ss').format('HH:mm:ss'),
          });
          journey_time.push({
            time: moment(row.time, 'HH:mm:ss'),
          });
          if (row.pointId) {
            rpoint.push({
              value: row.pointId,
              label: '',
            });
          } else {
            rpoint.push({
              value: '',
              label: '',
            });
          }
        });
        const { pointImages } = this.state;
        const { selectedImage } = this.state;
        for (let [i, val] of journey_points.entries()) {
          pointImages.push([]);
          selectedImage.push({ tripId: '', pointId: [], imageIds: [] });
          this.fetchPointImage(val.id, i);
        }

        this.setState({
          pointImages: pointImages,
          selectedImage: selectedImage,
          journey_points: journey_points,
          rpoint: rpoint,
          journey_time: journey_time,
        });
      }
    });
  }
  getRoutePoints(params) {
    route.getRoutePoint(params).then((res) => {
      const data = res.data;
      if (data.status) {
        const point = data.data;
        point.forEach((row) => {
          row['key'] = row['id'];
        });
        this.setState({
          points: this.setupRouteSelect(point),
        });
      }
    });
  }
  setupRouteSelect(list) {
    list.forEach(function (row) {
      row['value'] = row['point'].id;
      row['label'] = row['point'].name;
    });
    return list;
  }
  get = (id) => {
    trip.get(id).then((res) => {
      let form = this.state.form;
      if (res.data.status) {
        let data = res.data.data;
        form['tripId'] = data.id;
        form['name'] = data.name;
        form['vehicleId'] = data.vehicleId;
        form['startTime'] = data.startTime;
        form['isActive'] = data.isActive ? 1 : 0;
        this.setState({
          tripId: data.id,
          source: {
            label: data.startingPoint ? data.startingPoint.name : '',
            value: data.startingPoint ? data.startingPoint.id : '',
          },
          destination: {
            label: data.destinationPoint ? data.destinationPoint.name : '',
            value: data.destinationPoint ? data.destinationPoint.id : '',
          },

          time: moment(data.startTime, 'HH:mm:ss'),
        });
        this.setState({
          form,
          name: data.name,
        });
        this.getVehicles();
        this.getRoutePoints(data.routeId);
      }
    });
  };
  getPoints() {
    point.list().then((res) => {
      let data = res.data;
      let list = data.data;
      if (list) {
        // this.setState({
        //   'points': this.setupSelect(list),
        // });
      }
    });
  }
  getRoutes() {
    route.list().then((res) => {
      let data = res.data;
      if (data.data) {
        let list = data.data;
        // list.forEach(function (row) {
        //   row['value'] = row.id;
        //   row['label'] = row.name;
        // });
        this.setState({
          routes: list,
        });
      }
    });
  }
  getVehicles() {
    vehicle.list().then((res) => {
      let data = res.data;
      let list = data.data;
      const form = this.state.form;
      let listData = [];
      if (data.status) {
        let list = data.data;
        list.forEach((row) => {
          row['value'] = row.id;
          row['label'] = row.title;
          if (row['isActive']) {
            listData.push(row);
          }
          if (form.vehicleId === row.id) {
            this.setState({
              vehicleId: { id: row.id, label: row.vehicleNumber },
            });
          }
        });
        this.setState({
          vehicles: listData,
        });
      }
    });
  }
  setupSelect(list) {
    list.forEach(function (row) {
      row['value'] = row.id;
      row['label'] = row.name;
    });
    return list;
  }
  handleOpenChange = (open) => {
    var formatted = moment(open, 'HH:mm').format('HH:mm');
    const form = this.state.form;
    form['startTime'] = formatted;
    this.setState({
      form: form,
      time: open,
    });
  };
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required']);
    this.setState({ form: updatedValue.form, required: updatedValue.required });
  }
  handleSourceChange = (selectedOption) => {
    const form = this.state['form'];
    form['startingPointId'] = selectedOption.value;
    this.setState({ source: selectedOption });
    this.setState({ form: form });
  };

  handleRouteChange = (selectedOption) => {
    const form = this.state['form'];
    form['routeId'] = selectedOption;
    // this.setState({ 'route': selectedOption });
    this.setState({ form: form });
  };

  handleSelectChange = (selectedOption, type) => {
    if (type === 'vehicle') {
      const form = this.state.form;
      console.log(selectedOption);
      form['maxSeat'] = selectedOption.maxSeat;
      form['vehicleId'] = selectedOption.id;
      this.setState({ form, vehicleId: { id: selectedOption.id, label: selectedOption.vehicleNumber } });
      console.log(this.state.form.vehicleId);
    }
  };

  handleDestinationChange = (selectedOption) => {
    //const form = selectedOption.value;
    const form = this.state.form;
    form['destinationPointId'] = selectedOption.value;
    this.setState({ destination: selectedOption });
    this.setState({ form: form });
  };

  removeRow = (index) => {
    const journey_points = this.state.journey_points;
    const { selectedImage } = this.state;
    const { pointImages } = this.state;
    if (this.state.journey_points.length > 1) {
      journey_points.splice(index, 1);
      selectedImage.splice(index, 1);
      pointImages.splice(index, 1);
      this.setState({ journey_points: journey_points });
    }
  };

  handleJourneyTimeInput = (e, index) => {
    const value = moment(e, 'HH:mm:ss').format('HH:mm:ss');
    const journey_points = this.state.journey_points;
    const journey_time = this.state.journey_time;
    journey_time[index]['time'] = e;
    journey_points[index]['time'] = value;
    this.setState({ journey_points: journey_points, journey_time: journey_time });
  };
  fileChangedHandler = (event) => {
    let state = this.state.form;
    state['profile_image'] = event.target.files[0];
    this.setState({ form: state });
  };
  handlePointSubmit = (event) => {
    event.preventDefault();
    this.setState({
      ploading: true,
    });
    if (this.state.tripId !== '') {
      const journey_points = this.state.journey_points;
      console.log(journey_points);
      trip.addPoint({ points: journey_points, tripId: this.state.tripId }).then(
        (res) => {
          this.setState({
            ploading: false,
          });
          const data = res.data.data;
          if (res.data.status) {
            this.getTripPoints(this.state.tripId);
            res.data.data && data.msg
              ? notification.success(data.msg)
              : notification.success('Record Added');
          } else {
            notification.error(res.data.statusMessage);
          }
          // this.clearForm();
        },
        (error) => {
          this.setState({
            loading: false,
          });
          notification.error('Api error');
        }
      );
    } else {
      notification.error('Please add or choose a route');
    }
    this.addtripImages();
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
          required: req,
        });
      }
    });
    if (validate) {
      this.setState({
        loading: true,
      });
      if (this.state.tripId !== '') {
        this.update();
      } else {
        this.add();
      }
    }
  };

  add = () => {
    trip.add(this.state.form).then(
      (res) => {
        this.setState({
          loading: false,
        });
        if (res.data.status) {
          const data = res.data.data;
          this.setState({
            tripId: data.id,
          });
          notification.success('Record Added');
        } else {
          notification.error(res.data.statusMessage);
        }
        this.clearForm();
      },
      (error) => {
        this.setState({
          loading: false,
        });
        notification.error('Api error');
      }
    );
  };
  update = () => {
    trip.update(this.state.form).then(
      (res) => {
        this.setState({
          loading: false,
        });
        notification.success('Record Updated');
      },
      (error) => {
        this.setState({
          loading: false,
        });
        notification.error('Api error');
      }
    );
  };
  fetchPointImage = (id, index) => {
    point.getimages(id).then((res) => {
      const data = res.data;
      const { pointImages } = this.state;
      pointImages[index] = data.data;
      // console.log(pointImages)
      this.setState({
        pointImages: pointImages,
      });
      this.getpointImages(this.state.tripId, id, index, pointImages);
    });
  };
  getpointImages(tripId, pointId, index, pointImages) {
    trip.getTripImages(tripId, pointId).then((res) => {
      const { data } = res;
      if (data.status) {
        let rData = data.data;
        let imgeId = [];
        if (rData.length > 0) {
          const { selectedImage } = this.state;
          let imagearray = {};
          imagearray['tripId'] = this.state.tripId;
          imagearray['pointId'] = pointId;
          imagearray['imageIds'] = [];
          for (let val of rData) {
            for (let value of pointImages[index]) {
              if (val['pointImage'] && value) {
                if (val['pointImage'].image == value.image) {
                  if (imagearray['imageIds']) {
                    const index = imagearray['imageIds'].indexOf(value.id);
                    if (index === -1) {
                      imagearray['imageIds'].push(value.id);
                    }
                  }
                }
              }
            }
          }
          // imagearray['image'] = url
          selectedImage[index] = imagearray;
          this.setState({
            selectedImage: selectedImage,
          });
        }
      }
    });
  }
  selectImage(imgid, pointid, index, url) {
    const { selectedImage } = this.state;
    const imagearray = selectedImage[index];
    const { delImage } = this.state;
    imagearray['tripId'] = this.state.tripId;
    imagearray['pointId'] = pointid;
    imagearray['image'] = url;
    if (this.refs[`check_me_${imgid}`].checked) {
      const ix = imagearray['imageIds'].indexOf(imgid);
      if (ix === -1) {
        imagearray['imageIds'].push(imgid);
      }
      const index = delImage.indexOf(imgid);
      if (index > -1) {
        delImage.splice(index, 1);
      }
    } else {
      const index = imagearray['imageIds'].indexOf(imgid);
      if (index > -1) {
        imagearray['imageIds'].splice(index, 1);
      }
      delImage.push(imgid);
    }
    selectedImage[index] = imagearray;
    this.setState({
      selectedImage: selectedImage,
      delImage: delImage,
    });
  }
  addtripImages() {
    if (this.state.selectedImage.length > 0) {
      for (let val of this.state.selectedImage) {
        if (typeof val.tripId !== 'undefined' && val.tripId != '') {
          trip.addtripbookingimages(val).then((res) => {});
        }
      }
    }
    this.removeImages();
  }
  removeImages() {
    if (this.state.delImage.length > 0) {
      trip.removeImages(this.state.delImage).then((res) => {});
    }
  }
  render() {
    const { Option } = Srelect;
    const format = 'HH:mm A';
    const { pointImages } = this.state;
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Edit Trip Journey</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/journey"
                data-toggle="tooltip"
                title="Edit Journey"
              >
                <i className="fa fa-long-arrow-left"></i>Back
              </Link>
            </div>
          </div>
        </section>
        <section className="content">
          <Tabs
            defaultTab="one"
            onChange={(tabId) => {
              console.log(tabId);
            }}
          >
            <TabList>
              <Tab tabFor="one" className="tab_view">
                Description
              </Tab>
              <Tab tabFor="two" className="tab_view">
                Point
              </Tab>
            </TabList>
            <TabPanel tabId="one">
              <form onSubmit={this.handleSubmit}>
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Journey</h3>
                  </div>
                  <div className="box-body">
                    <div className="col-md-6" style={{ cursor: 'not-allowed' }}>
                      <div className="form-group">
                        <label className="control-label">Journey Name</label>
                        <InputComponent
                          propValues={{
                            label: 'Title',
                            required: this.state['required'].name,
                            value: this.state['form'].name,
                            onChange: this.handleUserInput.bind(this),
                            name: 'name',
                            isRequired: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={
                          this.state['required']['vehicleId']
                            ? 'form-group has-error'
                            : 'form-group'
                        }
                      >
                        <label className="control-label">Choose Vehicle</label>

                        <Select
                          value={this.state['vehicleId']}
                          className={this.state['required']['vehicleId'] ? 'error' : ''}
                          classNamePrefix="fwidth"
                          onChange={(e) => this.handleSelectChange(e, 'vehicle')}
                          options={this.state.vehicles}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="control-label" style={{ float: 'left' }}>
                        Start Time
                      </label>
                      <div
                        className={
                          this.state['required']['startTime']
                            ? 'form-group has-error'
                            : 'form-group'
                        }
                      >
                        <TimePicker
                          format="h:mm a"
                          use12Hours
                          value={this.state.time}
                          onChange={this.handleOpenChange}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">

                      <div className={
                        this.state["required"]["routes"]
                          ? "form-group has-error"
                          : "form-group"
                      }>
                        <label className="control-label">Route</label>
                        <Srelect className="full-width" name="destination" value={this.state.form['routeId']} onChange={(e) => this.handleRouteChange(e)} showSearch filterOption={(input, option) =>
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
                    </div> */}

                    {/* <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Max Seat',
                          required: this.state["required"].maxSeat,
                          value: this.state["form"].maxSeat,
                          onChange: this.handleUserInput.bind(this),
                          name: 'maxSeat',
                          isRequired: true

                        }} />

                    </div>  */}

                    {/* <div className="col-md-6">
                      <div className="form-group required">
                        <label className="control-label">Destination Point</label>

                        <Select
                          value={this.state["destination"]}
                          className={
                            this.state["required"]["destination"]
                              ? "form-width error"
                              : "form-width"
                          }
                          classNamePrefix="fwidth"
                          onChange={(e) => this.handleDestinationChange(e)}
                          options={this.state.points}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label className="control-label">Source Point</label>

                        <Select
                          value={this.state['source']}
                          className={
                            this.state["required"]["source"]
                              ? "error"
                              : ""
                          }
                          classNamePrefix="fwidth"
                          onChange={this.handleSourceChange}
                          options={this.state.points}
                        />
                      </div>

                    </div> */}

                    <div className="col-md-6">
                      <div
                        className={
                          this.state['required']['status']
                            ? 'form-group has-error'
                            : 'form-group'
                        }
                      >
                        <label className="control-label">Status</label>
                        <select
                          name="isActive"
                          value={this.state['form'].isActive}
                          className={
                            this.state['required']['isActive']
                              ? 'form-control error'
                              : 'form-control'
                          }
                          onChange={(e) => this.handleUserInput(e)}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="1">Active</option>
                          <option value="0">Deactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Attribute 1',
                          value: this.state['form'].attr1,
                          onChange: this.handleUserInput.bind(this),
                          name: 'attr1',
                          isRequired: false,
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <InputComponent
                        propValues={{
                          label: 'Attribute 2',
                          value: this.state['form'].attr2,
                          onChange: this.handleUserInput.bind(this),
                          name: 'attr2',
                          isRequired: false,
                        }}
                      />
                    </div>
                  </div>
                  <ActionComponent
                    loading={this.state.loading}
                    clearForm={this.clearForm}
                  ></ActionComponent>
                </div>
              </form>
            </TabPanel>
            <TabPanel tabId="two">
              <form onSubmit={this.handlePointSubmit}>
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">Points</h3>
                    <div className="pull-right">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.addMorePoint}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="box-body journeypoint">
                    {this.state.journey_points.map((val, index) => {
                      if(pointImages[index]){
                      return (
                        <div className="row" key={index}>
                          <div className="col-sm-12">
                            {pointImages[index].map((value) => {
                              return (
                                <div className="col-sm-2 mb-2" key={value.id}>
                                  <div className="pointimage">
                                    <div className="imgp">
                                      <input
                                        type="checkbox"
                                        ref={'check_me_' + value.id}
                                        onChange={() =>
                                          this.selectImage(
                                            value.id,
                                            val.id,
                                            index,
                                            value.image
                                          )
                                        }
                                        className="pointcheck"
                                        value={value.id}
                                        checked={
                                          this.state['selectedImage'][index][
                                            'imageIds'
                                          ].indexOf(value.id) > -1
                                            ? true
                                            : false
                                        }
                                      />
                                      <img
                                        src={
                                          this.apiurl +
                                          '/getImage/' +
                                          value.image
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="col-md-4">
                            <div className="form-group required">
                              <label className="control-label">Title</label>
                              {/* <Select
                                  value={this.state.rpoint[index]}
                                  classNamePrefix="fwidth"
                                  onChange={(e) => this.handlePointSourceChange(e, index)}
                                  options={this.state.points}
                                />*/}
                              <Srelect
                                className="full-width"
                                name="tripId"
                                value={this.state.journey_points[index]['pointId']}
                                onChange={(e) => this.handlePointSourceChange(e, index)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {this.state.points.map((val) => {
                                  return (
                                    <Option key={val.value} value={val.value}>
                                      {val.label}
                                    </Option>
                                  );
                                })}
                              </Srelect>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label className="control-label">Time</label>
                            <div className="form-group required">
                              <TimePicker
                                format="h:mm a"
                                use12Hours
                                value={this.state.journey_time[index].time}
                                onChange={(e) => this.handleJourneyTimeInput(e, index)}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            {/*<div className="form-group required">
                                        <label className="control-label">Time From Previous point</label>
                                            <input
                                              type="text"
                                              name="timeFromPrev"
                                              value={props.timeFromPrev}
                                              id="timepoint"
                                              className="form-control"
                                              autoComplete="off"
                                              placeholder="Time From Previous point"
                                              className="form-control"
                                              onChange={(e) => props.RoutePointInput(e,props.index)}
                                            />
                                          </div>*/}
                          </div>
                          <div className="col-md-1">
                            <button
                              type="button"
                              className="btn btn-danger btn-flat"
                              style={{ marginTop: '28px' }}
                              onClick={() => this.removeRow(index)}
                            >
                              <i className="fa fa-close"></i>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  }
                    )
  
}
                  </div>
                  <ActionComponent
                    loading={this.state.ploading}
                    clearForm={this.clearForm}
                  ></ActionComponent>
                </div>
              </form>
            </TabPanel>
            <TabPanel tabId="three">
              <p>Tab 3 content</p>
            </TabPanel>
          </Tabs>
        </section>
      </>
    );
  }
}
export default EditJourney;
