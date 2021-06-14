import React from 'react';


class ErrorHandller extends React.Component {
  constructor(props){
    super(props);
     this.state = {
        hasError: false,
          
        }      
      }
  
      componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log(error,info)
      }


  

  render() {
   
   
        if(this.state.hasError){
      return (   <div >
            <h1>Error</h1>
        </div>)
        }
        return (<>{this.props.children}</>)
   
  }
}

export default ErrorHandller