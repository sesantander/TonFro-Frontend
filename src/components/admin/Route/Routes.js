import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import MTable from '../MTable';
import route from '../../../services/route';
import { Link } from 'react-router-dom';
import { Button, Icon, Select } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Routes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: true,
      list: [],
      total: 1,
      source: '',
     
     
      destination: ''

    }
    this.heading = 'Routes';
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'name',

        sorter: (a, b) => { return a.name.localeCompare(b.name) },
        //render: name => `${name.first} ${name.last}`,
        //...this.getColumnSearchProps('name'),

      },
      /* {
         title: 'Source Point',
         dataIndex: 'email',
         sorter: (a, b) => {return a.email.localeCompare(b.email)},
         
       },
       {
         title: 'Destination Point',
         dataIndex: 'long',

       }, */
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (text, record) => (
          (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        ),
      },
      /*{
        title: 'Created',
        dataIndex: 'created_at',
      },*/
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button size="small" type="primary" className="mrg-rt"><Link to={'/route/edit/' + record.id} ><Icon type="edit" /></Link></Button>
        ),
      },
    ];
  }
  componentDidMount() {
    this.getList();
  }
  filter = () => {
    route.filter({startingPointId:this.state.source,endPointId:this.state.destination}).then(res=>{
      console.log(res)
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          list: list,
          total: (data.data.length / 10),
          loading: false
        });
      }
    })
  }
  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      source: value
    })
  }

  handledestinationChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      destination: value
    })
  }
  searchValue = (e) => {
    console.log(e.target.value)
    this.getList(e.target.value)
  }
  getList = () => {
    route.list().then(res => {
      console.log(res)
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          list: list,
          total: (data.data.length / 10),
          loading: false
        });
      }
    })
  }

  render() {
    const { Option } = Select;
    return (
      <>
        <section className="content-header">
          <ToastContainer />
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
              <Link className="btn btn-default pull-right" to="/route/add" data-toggle="tooltip" title="Add Routes"><i className="fa fa-plus"></i> Add Routes</Link>
            </div>
          </div>
        </section>
        <section className="content">
          {/* <div className="row">
            <div className="form-group col-md-3">
              <Select className="full-width" name="point_from" value={this.state.source} onChange={(e) => this.handleChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.list.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div className="form-group col-md-3">
              <Select className="full-width" name="destination" value={this.state.destination} onChange={(e) => this.handledestinationChange(e)} showSearch filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {
                  this.state.list.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>{val.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="col-md-3">
            <Button type="primary pull-left" onClick={this.filter}>Search</Button>
            </div>
          </div>
          */}
          <div className="box">
            <div className="box-header with-border">
              <div className="col-md-9"><h3 className="box-title">{this.heading}</h3></div>
              <div className="col-md-3">
                {/* <input type="text" className="form-control" onChange={(e) => this.searchValue(e)} /> */}
                </div>
            </div>
            <div className="box-body table-responsive">
              <MTable data={this.state.list} column={this.columns} />
              {/* <table className="table table-striped">
                                 <tbody>
                                  <tr>
                                     <th>Name</th>
                                     <th>Email</th>
                                     <th>Group</th>
                                     <th>Status</th>
                                     <th>Action</th>
                                  </tr>
                                
                             
                                  {
                                  this.state.list.map(val=>{
                                  return (
                                  <tr key={val.id}>
                                     <td>{val.name}</td>
                                     <td>{val.email}</td>
                                     <td> {val.role}
                                     </td>
                                     <td>{val.enterprise_id}</td>
                                     <td>
                                     <Link to={'/user/edit/'+val.id} className="btn btn-info btn-xs">Edit</Link>
                                     <button type="button" className="btn btn-warning btn-xs">Pass</button>
                                     </td>
                                  </tr>
                                  )
                                  })   
                                  }
                               </tbody>
                            </table>*/}
            </div>
            <div className="box-footer clearfix">
              <ReactPaginate
                pageCount={this.state.total}
                pageRangeDisplayed={1}
                marginPagesDisplayed={2}
                previousLabel="«"
                activeClassName="active"
                onPageChange={this.handlePageClick}
                containerClassName="pagination pagination-sm no-margin pull-right"
              ></ReactPaginate >
            </div>
          </div>


        </section>
      </>
    )
  }
}
export default Routes