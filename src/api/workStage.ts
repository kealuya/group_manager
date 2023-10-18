import request from "./request";

export function addProgram(data) {
  return request({
    url: "/work/addInfo",
    method: "post",
    data: {
      addData:data
    }
  });
}
export function editProgram(data) {
  return request({
    url: "/work/editInfo",
    method: "post",
     data:{
       editData:data
     }
  });
}
export function deleteProgram(id) {
  return request({
    url: "/work/deleteInfo",
    method: "post",
    data:{
      id:id
    }
  });
}
export function getWorkList(search,page,pageSize) {
  return request({
    url: "/work/getList",
    method: "post",
    data: {
      search: search,
      page:page,
      pageSize:pageSize
    }
  });
}
