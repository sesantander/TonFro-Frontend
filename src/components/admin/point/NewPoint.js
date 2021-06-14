import React, { Component } from 'react'
// import user from '../../../services/user';
// import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import point from '../../../services/point';
import ActionComponent from '../ActionComponent';
import InputComponent from '../InputComponent';
import notification from '../../../services/notification';
import { ToastContainer } from 'react-toastify';
import AdminLTELogo from '../../../assets/img/AdminLTELogo.png'
import { Popconfirm, Icon } from 'antd';

class NewPoint extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'form': {
        "name": '',
        "lat": '',
        "long": '',
        "isActive": 0,
        'attr1': '',
        'attr2': ''

      },
      'required': {
        "name": false,
        "lat": false,
        "long": false,

      },
      "loading": false,
      "pointImages": [],

    };
    this.requiredText = ["name", "lat", "long"];
    this.apiurl = process.env.REACT_APP_BASE_URL;
    this.heading = 'Add Point'


  }
  componentDidMount() {
    let params = this.props.match.params;
    if (typeof params.id !== 'undefined') {
      let form = this.state.form;
      form['pointId'] = params.id;
      this.setState({
        form: form
      })
      this.heading = 'Edit Point'

      this.get(params.id);
      this.fetchImage(params.id);
    }

  }
  handleUserInput(e) {
    let updatedValue = notification.handleInput(e, this.state['form'], this.state['required'])
    console.log(updatedValue.form.isActive)
    updatedValue.form.isActive = (updatedValue.form.isActive === '0') ? 0 : 1;
    this.setState({ 'form': updatedValue.form, 'required': updatedValue.required });
    console.log(this.state.form)

  }
  get = (id) => {
    point.get(id).then(res => {
      console.log(res)
      let data = res.data.data;
      let form = this.state.form;
      if (data) {
        form['name'] = data.name;
        form['lat'] = data.lat;
        form['long'] = data.long;
        form['isActive'] = (data.isActive) ? 1 : 0;
        this.setState({
          'pointId': data.id
        })
        this.setState({
          form
        });
      }
    })
  }

  fetchImage = (id) => {
    point.getimages(id).then(res => {
      const data = res.data;
      if(data.status){
      this.setState({
        pointImages: data.data
      })
}

    })
  }
  fileChangedHandler = event => {
    let state = this.state.form;
    state['profile_image'] = event.target.files[0];
    this.setState({
      'form': state
    });
    console.log(this.state)
  }
  clearForm = () => {
    this.setState({
      'form': {
        "name": 'Golden Villa, rewari',
        "lat": '28.1741',
        "long": '76.7031',
        "isActive": 0,
        'attr1': '',
        'attr2': ''
      }
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let req = this.state.required;
    const formData = new FormData(event.target);
    let validate = true;
    this.requiredText.forEach((v) => {
      if (this.state['form'][v] === '') {
        req[v] = true;
        validate = false;
        this.setState({
          'required': req
        });
        console.log(this.state)
      }
    });
    if (validate) {
      this.setState({
        'loading': true
      });
      if (this.state.form.pointId) {
        this.update(formData)
      } else {
        this.add(formData);
      }

    }

  }
  uplodaimage(formdata) {
    point.uplodaimage(formdata).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      let form = this.state.form;
      this.fetchImage(form['pointId']);

      // notification.success('Record Updated');

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })

  }
  removeImg(id) {
    point.deleteimages([id]).then(res => {
      console.log(res);
      notification.success('Image removed');
      let form = this.state.form;

      this.fetchImage(form['pointId']);
      //this.getimages();
    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })

  }
  add = (formData) => {
    
    point.add(this.state.form).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      let data = res.data;
      console.log(data);
      if (data.status) {
        data = data.data;
        console.log(data);
        let newform = new FormData();
        let form1 = this.state.form;
        form1['pointId'] = data.id;
        this.setState({
          form: form1
        })
        newform.append('pointId', data.id)
        formData.append('pointId', data.id);
        let j = 1;
        for (let [i, v] of formData.entries()) {
          if (i === 'image[]') {
            newform.append('image' + j, v);
            j = j + 1;
          }
        }
        let vimage = document.getElementById('doc_file');
        formData.append('pointId', data.id);
        if (vimage.files.length > 0) {
          newform.append('imageCount', vimage.files.length)
          this.uplodaimage(newform)
        }
        notification.success('Record Added');
        //this.clearForm();
      } else {
        notification.error(data.statusMessage);

      }
    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }
  update = (formData) => {
    const f = this.state.form;
    point.update(f).then(res => {
      console.log(res);
      this.setState({
        'loading': false
      });
      let newform = new FormData();
      // formData.delete("name");
      // formData.delete("lat");
      // formData.delete("long");
      // formData.delete("attr1");
      // formData.delete("attr2");
      // formData.delete("isActive");
      let data = res.data;
      console.log(data)
      if (data.status) {
        data = data.data;

        let j = 1;
        for (let [i, v] of formData.entries()) {
          if (i === 'image[]') {
            newform.append('image' + j, v);
            j = j + 1;
          }
        }
        let form = this.state.form;
        let vimage = document.getElementById('doc_file');
        formData.append('pointId', data.id);
        if (vimage.files.length > 0) {
          newform.append('imageCount', vimage.files.length)
          newform.append('pointId', form['pointId'])
          this.uplodaimage(newform)

        }
      }
      this.fetchImage(this.state.form.pointId);
      notification.success('Record Updated');

    }, error => {
      this.setState({
        'loading': false
      });
      notification.error('Api error')
    })
  }
  render() {
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
                to="/point"
                data-toggle="tooltip"
                title="Add Point"
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
                <h3 className="box-title">Point</h3>
              </div>
              <div className="box-body">
                <div className="row">
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: 'Name',
                        required: this.state["required"].name,
                        value: this.state["form"].name,
                        onChange: this.handleUserInput.bind(this),
                        name: 'name',
                        isRequired: true

                      }} />

                  </div>
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: 'Lat',
                        required: this.state["required"].lat,
                        value: this.state["form"].lat,
                        onChange: this.handleUserInput.bind(this),
                        name: 'lat',
                        isRequired: false
                      }} />

                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: 'Long',
                        required: this.state["required"].long,
                        value: this.state["form"].long,
                        onChange: this.handleUserInput.bind(this),
                        name: 'long',
                        isRequired: true

                      }} />
                  </div>
                  <div className="col-md-6">
                    <div className="form-group required">
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
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: 'Attribute 1',

                        value: this.state["form"].attr1,
                        onChange: this.handleUserInput.bind(this),
                        name: 'attr1',
                        isRequired: false

                      }} />
                  </div>
                  <div className="col-md-6">
                    <InputComponent
                      propValues={{
                        label: 'Attribute 2',

                        value: this.state["form"].attr2,
                        onChange: this.handleUserInput.bind(this),
                        name: 'attr2',
                        isRequired: false

                      }} />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="control-label pt_5">Add Ponit Images</label>
                      <label htmlFor="doc_file" className="c_upload" ><i className="fa fa-upload c_upload"></i> Upload
                             <input type="file" id="doc_file" name="image[]" className="custome_file" multiple onChange={this.fileChangedHandler} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {
                    this.state.pointImages.map(val => {
                      return (
                        <div className="col-sm-2 mb-2" key={val.id}>

                          <div className="pointimage">
                            <Popconfirm
                              title="Are you sure？"
                              icon={<Icon type="question-circle-o" style={{ color: 'red' }}
                              />}
                              onConfirm={() => this.removeImg(val.id)}
                            >
                              <i className="fa fa-fw fa-close"></i>
                            </Popconfirm>

                            <div className="imgp">
                              <img src={this.apiurl + '/getImage/' + val.image} />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
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
export default NewPoint