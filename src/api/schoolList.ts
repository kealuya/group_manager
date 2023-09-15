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
export function addSchoolInfo(ruleFormAdd) {
  return request({
    url:"/school/addInfo",
    method:"post",
    data:{
      ruleFormAdd: ruleFormAdd
    }

    // data:{
    //   school:name,
    //   fzr1:fzr1,
    //   fzl2:fzr2,
    //   xt:xt,
    //   buildStage:buildStage,
    //   service:service,
    //   fwsxy_start_date:fwsxy_start_date,
    //   fwsxy_end_date:fwsxy_end_date,
    //   qtxy:qtxy,
    //   remark:remark
    // }
  })
}
