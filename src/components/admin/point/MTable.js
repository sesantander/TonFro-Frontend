import React from 'react';
import { Table } from 'antd';
// import Highlighter from 'react-highlight-words';
// import { Link } from 'react-router-dom';


class MTable extends React.Component {
  constructor(props){
    super(props);
     this.state = {
          searchText: '',
          searchedColumn: '',
        }      
      }
  



  

  render() {
   // console.log(this.props.data)
    return (<Table columns={this.props.column} dataSource={this.props.data} >
            <span slot="isActive" slot-scope="isActive">
             
               (isActive)?<span className="label label-success">Active</span>:<span className="label label-danger">Deactive</span>
             
          </span>
          </ Table>)
  }
}

export default MTable