import {  toast } from 'react-toastify';

export default {
   success (msg) {
    return toast.success(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
  },
 error(msg){
     toast.error(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
  },
  handleInput(e,form,required){
    const name = e.target.name;
    const value = e.target.value;
    form[name] = value;
    required[name] = true;
    if(value!==''){
    required[name] = false; 
    }
    return {'form':form,'required':required};

  }

}  
