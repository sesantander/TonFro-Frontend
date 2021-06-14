import Api from './api/authapi'


export default {
	
   get (params) {
  	console.log(params);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/get', {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     }, params)

  },
  sendsms (params) {
  	console.log(params);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/order/sms', params,{
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
   add (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/order/create', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
   update (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/update', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  filter(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/booking/filtered', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },

  getBooking(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/booking/getBooking', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },


   update (params,id) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/update/'+id, params)

  },
  list (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
                    apiurl+'/booking/all',{},
                   {
                   headers: {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     }
                     )

  },
  getUser (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'booking/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
    downloadExcel(params) { 
      console.log('mira que mando',params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/booking/getExcel',params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/vnd.openxmlformats'
      },
      responseType: 'blob',
      
    })

  },

  downloadInvoice(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/booking/generateInvoice',params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        
      },
      
      
    })

  },
  getInvoice() { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/booking/getInvoice', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        
      },
      responseType: 'blob',
      
    })

  },
  checkout(params) { 
    
    return Api().post('https://checkout.razorpay.com/v1/checkout.js',params)
     
    

  },

  getRoutePriceSeat (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/booking/getRoutePriceSeat',params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
}