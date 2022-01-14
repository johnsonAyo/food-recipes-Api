import { IUser } from '../utils/interface';
import { Request } from 'express';

export interface CustomReq extends Request {
  user?: IUser;
}
