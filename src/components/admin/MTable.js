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
  
      componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log(error,info)
      }


  

  render() {
  //  console.log(this.props.data)
   const pagination = (this.props.pagination)?parseInt(this.props.pagination):10;
    return <Table columns={this.props.column} dataSource={this.props.data} loading={this.props.loading}  pagination={{pageSize:pagination}}/>;
  }
}

export default MTable