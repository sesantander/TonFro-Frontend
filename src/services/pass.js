import Api from './api/authapi'


export default {

  get(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/pass/get', {
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
     return Api().post(apiurl + '/pass/add', params, {
   
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  update(params,id) {
    console.log(params);
    console.log("el id", id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/pass/update/' +id , params, {
   
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })
  },

  filter(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/pass/filter', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  list(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/pass/all', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },

  listPurchasedPasses(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/pass/allPurchasedPasses', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getPass(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/pass/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
      
  addPassPoint(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/pass/points/add', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getPassPoint(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/pass/points/get' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  downloadExcel() { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/pass/excel', {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/vnd.openxmlformats'
      },
      responseType: 'blob',
      
    })

  },

  filterPurchasedPasses(params) {
        console.log(params);
        const apiurl = process.env.REACT_APP_URL;
        return Api().post(apiurl + '/pass/filterPurchasedPasses', params, {
            headers:
                {
                    'user-type': 'admin',
                    'token': localStorage.getItem('token'),
                }
        })

    },



}