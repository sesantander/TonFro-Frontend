import Api from './api/authapi'


export default {

  get(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/route/' + params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getRoutePoint(id) {

    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/route/point/all', { 'routeId': id }, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  filter(params) {
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/filtered', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  add(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/route/add', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  addRoutePoint(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/route/point/update', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  update(params) {
    console.log(params);
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/route/update', params, {
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
    return Api().post(
      apiurl + '/route/all', {},
      {
        headers: {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
        }
      }
    )

  },
  getUser(id) {
    console.log(id);
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/route/' + id, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
}