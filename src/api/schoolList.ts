import request from "./request";

export function getSchoolList1(data, isOwner) {
  return request({
    url: "/school/list",
    method: "post",
    data: {
      code: data,
      isOwner: isOwner
    }
  });
}

export function getSchoolInfo(name) {
  return request({
    url:"/school/getInfo",
    method:"post",
    data:{
      school:name
    }
  })
}
export function getSchoolCodeInfo(name) {
  return request({
    url:"/school/getSchoolCodeInfo",
    method:"post",
    data:{
      school_name:name
    }
  })
}
export function addSchoolInfo(ruleFormAdd) {
  return request({
    url:"/school/addInfo",
    method:"post",
    data:{
      ruleFormAdd: ruleFormAdd
    }

  })
}

export function editSchoolInfo(ruleFormEditArray,school_code) {
  return request({
    url:"/school/editInfo",
    method:"post",
    data:{
      ruleFormEditArray: ruleFormEditArray,
      school_code:school_code
    }

  })
}

export function deleteSchoolAll(school_code) {
  return request({
    url:"/school/delete",
    method:"post",
    data:{
      school_code:school_code
    }

  })
}
export function deleteSchoolModule(school_code,id) {
  return request({
    url:"/school/delete",
    method:"post",
    data:{
      id:id,
      school_code:school_code
    }

  })
}
