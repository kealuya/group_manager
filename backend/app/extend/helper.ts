import { ControllerResponse } from "@/module/main/controller";


const helper = {
  makeControllerResponse: (data: any): ControllerResponse => {
    return {
      success: true,
      msg: "",
      data: data
    };
  }
};

export default helper;
