

export const status = {
    success: 'success',
    error: 'error'
  }
  
export const axiosActions = {
  status: function(res) {
    return res.status
  },
  isOk: function(res) {
    return res.status === 200
  },
  hasErrors: function(res) {
    return res.data && !!res.data.errors
  },
  data: function(res) {
    return res.data.data
  },
  errors: function(res) {
    return res.data.errors
  },
  errorMessage: function(res) {
    if (res.data.errors && res.data.errors.length > 0) {
      return res.data.errors.map(err => {
        return map.title}
        ).join(', ');
    } else {
      return 'no error message found'
    }
  }
}