import React, { Component } from 'react'
// import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
// import point from '../../../../services/point';
import ActionComponent from '../../ActionComponent';
// import InputComponent from '../../InputComponent';
import notification from '../../../../services/notification';
import { ToastContainer } from 'react-toastify';
import driver from '../../../../services/driver';

class Kyc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'form': {
        "name": 'Test',
        "lat": '1234',
        "long": '123',
        "status": '',

      },
      'required': {
        "name": false,
        "lat": false,
        "long": false,

      },
      "driverId": "",
      "loading": false,

    };
    this.requiredText = ["name", "lat", "long"];


  }
  componentDidMount() {
    let params = this.props.match.params;
    if (typeof params.id !== 'undefined') {
      this.setState({
        'driverId': params.id
      })
      //this.getUser(params.id);
    }

  }
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required'])
    this.setState({ 'form': updatedValue.form, 'required': updatedValue.required });
  }
  getUser = (id) => {
    // user.getUser(id).then(res => {
    //     console.log(res)
    //     let data = res.data;

    // })
  }

  fileChangedHandler = event => {
    let state = this.state.form;
    state['profile_image'] = event.target.files[0];
    this.setState({
      'form': state
    });
    // console.log(this.state)
  }
  clearForm = () => {
    this.setState({
      'form': {
        "name": '',
        "lat": '',
        "long": '',
        "status": '',
      }
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let req = this.state.required;
    let validate = true;
    const formData = new FormData(event.target);
    this.requiredText.forEach((v) => {
      if (this.state['form'][v] === '') {
        req[v] = true;
        validate = false;
        this.setState({
          'required': req
        });
        // console.log(this.state)
      }

    });
    if (validate) {
      this.setState({
        'loading': true
      });
      driver.kyc(formData).then(res => {
        // console.log(res);
        const data = res.data;
        this.setState({
          'loading': false
        });
        if (res.data.status) {
          notification.success('Images Uploaded Successfully')
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
    const data = new FormData();
    console.log(data)

  }
  render() {
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Driver</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/driver"
                data-toggle="tooltip"
                title="Back"
              >
                <i className="fa fa-long-arrow-left"></i>Back
                  </Link>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">KYC</h3>
              </div>
              <div className="box-body">

                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="pull-left">
                      <label className="control-label pt_5"></label>
                      <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i>Add Proof Image
                         <input type="file" className="custome_file" name="addProofImage" id="doc_file" onChange={this.fileChangedHandler} />
                        <input type="hidden" name="driverId" value={this.state.driverId} />
                      </label>
                    </div>
                  </div>

                </div>
                <div className="row mb-4">

                  <div className="col-md-4">
                    <div className="pull-left">
                      <label className="control-label pt_5"></label>
                      <label htmlFor="idProofImage" className="c_upload" ><i className="fa fa-upload c_upload"></i>Add Id Proof
                         <input type="file" className="custome_file" name="idProofImage" id="idProofImage" onChange={this.fileChangedHandler} />

                      </label>
                    </div>

                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group required">
                      <label className="control-label">Description</label>
                      <textarea
                        value={this.state["form"].description}
                        id="phone"
                        className="form-control" rows={4}
                        onChange={(e) => this.handleUserInput(e)}></textarea>

                    </div>
                  </div>

                </div>


              </div>
              <ActionComponent loading={this.state.loading} clearForm={this.clearForm}></ActionComponent>
            </div>
          </form>
        </section>
      </>

    )
  }
}
export default Kyc