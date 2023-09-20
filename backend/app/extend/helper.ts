import { ControllerResponse } from "@/module/main/controller";


const helper = {
  makeControllerResponse: (data: any): ControllerResponse => {
    return {
      success: true,
      msg: "",
      data: data
    };
  },
  makeWrongControllerResponse: (data: any): ControllerResponse => {
    return {
      success: false,
      msg: "",
      data: data
    };
  }
};

export default helper;
