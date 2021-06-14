import Api from './api/authapi'


export default {

  get(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/vehicle/imei/get', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    }, params)

  },
  add(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
     return Api().post(apiurl + '/vehicle/imei/add', params, {
   
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  update(params) {
    console.log("xddddddddddd",params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/vehicle/imei/update', params, {
   
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })
  },

 
  /*
  list(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
      apiurl + '/vehicle/imei/all', {},
      {
        headers: {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
        }
      }
    )

  },
  */

  list () {
        const apiurl = process.env.REACT_APP_URL;
        return Api().get(apiurl+'/vehicle/imei/all', {
            headers:
                {
                    'user-type': 'admin',
                    'token': localStorage.getItem('token'),
                }
        })

   },

  
  getvehicleIMEI(id) {
   
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/vehicle/imei/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
      
 
  downloadExcel() { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/vehicle/imei/excel', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/vnd.openxmlformats'
      },
      responseType: 'blob',
      
    })

  },
}