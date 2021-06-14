import Api from './api/authapi'


export default {
	
   get (id) {
  	console.log(id);
  	const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'/vehicle/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
   add (params,id) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/vehicle/add', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
   addimei (params,id) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/vehicle/imei/assignedVehicle', params, {
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
    return Api().post(apiurl+'/vehicle/update', params,{
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  uplodaimage (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl+'/vehicle/image', params,{
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  assignDriver (params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().put(apiurl+'/vehicle/updateDriver', params, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                       }
                     })

  },
  list (params) {
    console.log(params);
    const filter = {vehicleNumber:params}
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
                    apiurl+'/vehicle/all',filter,
                    {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     }
                     , params)

  },
  getUser (id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'user/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
  getimei () { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'/vehicle/imei/all', {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  }, 
   getvehicleimei (id) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl+'/vehicle/imei/'+id, {
                      headers: 
                      {
                        'user-type': 'admin',
                        'token': localStorage.getItem('token'),
                       }
                     })

  },
}