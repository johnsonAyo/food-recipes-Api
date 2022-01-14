interface ErrorInt {
  success: boolean;
  status: number;
  message: string;
  data: object;
}

interface IUser {
  _id: string;
  email: string;
  password: string;
  fullname: string;
}

export { ErrorInt, IUser };
