import Api from './api/authapi'


export default {

  get(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/trip/' + params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },

  getBooking(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/trip/booking/' + params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getTripsBooking(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/trip/booking/all/'+params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getBookingAllPrice(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/getAllPrice', {tripId:params}, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  add(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/add', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  removeImages(params) {  
    const apiurl = process.env.REACT_APP_URL;
    return Api().delete(apiurl + '/trip/addPoints/image', {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      },data:{ids:params}
    }, )

  },
  updatebooking(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/booking/update', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  addtripbookingimages(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/addPoints/image', params, {
      headers: {
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
  getPoint(id) {

    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/allPoints', { 'tripId': id }, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getTripImages(tripId, pointId) {

    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/addPoints/image/all', { 'tripId': tripId, 'pointId': pointId }, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  update(params, id) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/update', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  list(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
      apiurl + '/trip/all', {},
      {
        headers:
        {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
        }
      }
    )

  },
  addPoint(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/addPoints', params, {
      headers:
      {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
  getUser(id) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().get(apiurl + '/trip/' + id, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })
  },

  addbooking(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/booking/add', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },

  listbooking(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(
      apiurl + '/trip/booking/all', {},
      {
        headers:
        {
          'user-type': 'admin',
          'token': localStorage.getItem('token'),
        }
      }
    )

  },

  addseat(params) { 
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/updateSeat', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },

  addprice(params) {
     
    const apiurl = process.env.REACT_APP_URL;
    return Api().post(apiurl + '/trip/addPrice', params, {
      headers: {
        'user-type': 'admin',
        'token': localStorage.getItem('token'),
      }
    })

  },
}