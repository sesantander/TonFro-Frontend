import React, { Component } from 'react';
// import ReactPaginate from 'react-paginate';
// import TableLoader from '../TableLoader';
import { Button, Icon } from 'antd';
import MTable from '../MTable';

import driver from '../../../services/driver';
import { Link } from 'react-router-dom';

class Driver extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true
    }
    this.heading = 'Drivers';
    this.columns = [

      {
        title: 'Name',
        dataIndex: 'user.name',
        sorter: (a, b) => {
          a.user = (a.user != null) ? a.user : { name: '' };
          b.user = (b.user != null) ? b.user : { name: '' };
          a.user.name = (a.user != null && a.user.name != null) ? a.user.name : '';
          b.user.name = (b.user != null && b.user.name != null) ? b.user.name : '';
          return a.user.name.localeCompare(b.user.name)
        },

      },
      {
        title: 'Email',
        dataIndex: 'user.email',
        sorter: (a, b) => {
          a.user = (a.user != null) ? a.user : { email: '' };
          b.user = (b.user != null) ? b.user : { email: '' };
          a.user.email = (a.user.email != null) ? a.user.email : '';
          b.user.email = (b.user.email != null) ? b.user.email : '';
          return a.user.email.localeCompare(b.user.email)
        },

      },
      {
        title: 'Phone Number',
        dataIndex: 'user.mobile',
        //sorter: (a, b) => { return a.user.email.localeCompare(b.user.email) },

      }, {
        title: 'Status',
        key: 'isActive',
        render: (text, record) => (
          (record.isActive) ? <span className="label label-success">Active</span> : <span className="label label-danger">Deactive</span>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <><Button size="small" type="primary" className="mrg-rt"><Link to={'/driver/edit/' + record.id}><Icon type="edit" /></Link></Button>
            <Button size="small" type="primary" className="mrg-rt"><Link to={'/kyc/add/' + record.id} target="_blank" >KYC</Link></Button></>
        ),
      },
    ];
  }
  componentDidMount() {
    this.getList('');
  }

  searchValue = (e) => {
    console.log(e.target.value)
    this.getList(e.target.value)
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info)
  }
  getList = (v) => {
    driver.list(v).then(res => {
      console.log(res)
      let data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row['key'] = row.id;
        })
        this.setState({
          list: data.data,
          total: (data.total / 10),
          loading: false

        })
      }
    })
  }
  render() {
    return (
      <>
        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>{this.heading}</h1>
            </div>
            <div className="pull-rigth">
             <Link className="btn btn-default pull-right" to="/driver/add" data-toggle="tooltip" title="Add Driver"><i className="fa fa-plus"></i> Add Driver</Link>
            </div>
          </div>
        </section>
        <section className="content">

          <div className="box">
            <div className="box-header with-border">
              <div className="col-md-9"><h3 className="box-title">{this.heading}</h3></div>
              <div className="col-md-3">
                {/* <input type="text" className="form-control" onChange={(e)=>this.searchValue(e)} /> */}
              </div>
            </div>
            <div className="box-body table-responsive">
              <MTable data={this.state.list} column={this.columns} loading={this.state.loading} />
              {/*<table className="table table-striped">
                                 <tbody>
                                  <tr>
                                     <th>S.No</th>
                                     <th>Name</th>
                                     <th>Email</th>
                                     <th>Status</th>
                                     <th>Action</th>
                                  </tr>
                                
                             
                                  {
                                  this.state.list.map((val,index)=>{
                                  return (
                                  <tr key={val.id}>
                                     <td>{index+1}</td>
                                     <td>{val.idProofName}</td>
                                     <td>{val.email}</td>
                                      
                                     <td>{
                                      (val.isActive)?<span className="label label-success">Active</span>:<span className="label label-danger">Deactive</span>
                                    }</td>
                                     <td>
                                     <Button size="small" type="primary" className="mrg-rt"><Link to={'/user/edit/'+val.id}><Icon type="edit" /></Link></Button>
                                       <Button className="btn btn-warning btn-xs" size="small" type="primary" className="mrg-rt"><Link to={'/kyc/add/'+val.id} target="_blank" >KYC</Link></Button>
                                     </td>
                                  </tr>
                                  )
                                  })   
                                  }{
                                  this.state.loading?<TableLoader colspan="8" />:null
                                  }
                               </tbody>
                            </table>*/}
            </div>
            {/* <div className="box-footer clearfix">
                       <ReactPaginate 
                            pageCount={this.state.total}
                            pageRangeDisplayed={1}
                            marginPagesDisplayed={2}
                            previousLabel="«"
                            activeClassName="active"
                            onPageChange={this.handlePageClick}
                            containerClassName="pagination pagination-sm no-margin pull-right"
                            ></ReactPaginate >
                      </div>*/}
          </div>


        </section>
      </>
    )
  }
}
export default Driver