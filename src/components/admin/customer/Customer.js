import React, { Component } from "react";
import user from "../../../services/user";
// import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
// import TableLoader from "../TableLoader";
import MTable from "../MTable";
import { Button, Icon, Input } from "antd";
import { saveAs } from 'file-saver';
import moment from 'moment';


class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      list: [],
      total: 1,
      loading: true,
      filter: {
        "email": '',
        "mobile": '',
        "name": '',

      },
    };
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => {
          a.name = a.name != null ? a.name : "";
          b.name = b.name != null ? b.name : "";
          return a.name.localeCompare(b.name);
        }
      },
      {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) => {
          a.email = a.email != null ? a.email : "";
          b.email = b.email != null ? b.email : "";
          return a.email.localeCompare(b.email);
        }
      },
      {
        title: "Mobile",
        dataIndex: "mobile"
      },

      {
        title: "Gender",
        dataIndex: "gender",
        sorter: (a, b) => {
          return a.gender.localeCompare(b.gender);
        }
      },
      {
        title: 'Created Date',
        dataIndex: '_date',
        sorter: (a, b) => {
          a.createdAt = a.createdAt != null ? a.createdAt : "";
          b.createdAt = b.createdAt != null ? b.createdAt : "";
          return moment(a.createdAt).unix() - moment(b.createdAt).unix()
        }
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
            <Button size="small" type="primary" className="mrg-rt">
              <Link to={"/customer/edit/" + record.id}  >
                <Icon type="edit" />
              </Link>
            </Button>
          </>
        )
      }
    ];
  }
  filter = (event) => {
    console.log(event)
    event.preventDefault();
    user.filter(this.state.filter).then(res => {
      console.log(res);
      let data = res.data;
      console.log(data);

      if (data.status) {
        let list = data.data;
        list.forEach(function (row) {
          row["key"] = row.id;
          row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');

        });

        this.setState({
          list: list,
          total: (data.data.length / 10),
          loading: false
        });
      }
    })
  }
  downloadExcel = () => {
    user.downloadExcel().then(res => {
      console.log(res)
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // let url = window.URL.createObjectURL(blob);
      //   let a = document.createElement('a');
      //   a.href = url;
      //   a.download = 'assets/excel.xlsX';
      //   a.click();
      saveAs(blob, 'customers.xlsx');
    })
  }
  handleFilterInput = (e) => {
    const form = this.state['filter'];
    form[e.target.name] = e.target.value;
    this.setState({
      filter: form
    })
  }
  componentDidMount() {
    this.getList();
  }
  getList = () => {
    user.list().then(res => {
      const data = res.data;
      if (data.data) {
        let list = data.data;
        list.forEach(function (row) {
          row["key"] = row.id;
          row['_date'] = moment(moment(row.createdAt, 'YYYY/MM/DD HH:mm:ss')).format('DD-MMMM-YYYY HH:mm:ss a');

        });

        this.setState({
          loading: false,
          list: list,
          total: data.total / 10
        });
      }
    });
  };
  render() {

    return (
      <>
        <section className="content-header">
          <div className="bg-light lter b-b wrapper-md clearfix">
            <div className="pull-left">
              <h1>Customers</h1>
            </div>
            <div className="pull-rigth">
              <Link
                className="btn btn-default pull-right"
                to="/customer/add"
                data-toggle="tooltip"
                title="Add Customer">
                <i className="fa fa-plus"></i> Add Customer
              </Link>
            </div>

          </div>
        </section>
        <section className="content">
          <form id="filterform" onSubmit={this.filter}>
            <div className="row">
              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Email"
                  name="email"
                  type="email"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.email}
                />
              </div>

              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Name"
                  name="name"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.name}
                />
              </div>
              <div className="form-group col-md-3">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Mobile"
                  name="mobile"
                  onChange={(e) => this.handleFilterInput(e)}
                  value={this.state.filter.mobile}
                />
              </div>

              <div className="col-md-2">
                <Button type="primary pull-left" htmlType="submit">Search</Button>
              </div>

            </div>
          </form>
          <div className="box">
            <div className="box-header with-border">
              <div className="pull-right">
                <Button
                  type="primary"

                  onClick={this.downloadExcel}>
                  Excel
              </Button>
              </div>
              <h3 className="box-title">Customer</h3>
            </div>
            <div className="box-body table-responsive">
              <MTable
                data={this.state.list}
                column={this.columns}
                loading={this.state.loading}
              />
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
                                  {
                                  this.state.loading?<TableLoader colspan="8" />:null
                                  }
                               </tbody>
                            </table>*/}
            </div>
            {/*  <div className="box-footer clearfix">
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
    );
  }
}
export default Customer;
