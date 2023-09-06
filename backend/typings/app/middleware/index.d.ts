// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportJwtCheck from '../../../app/middleware/jwt_check';

declare module 'egg' {
  interface IMiddleware {
    jwtCheck: typeof ExportJwtCheck;
  }
}
