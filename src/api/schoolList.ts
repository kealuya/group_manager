import request from './request'

export function getSchoolList1(data,isOwner) {
  return request({
    url: '/school/list',
    method: 'post',
    data:{
      code:data,
      isOwner:isOwner
    }
  })
}
