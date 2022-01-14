import express, { NextFunction, Request, Response } from 'express';
const { promisify } = require('util');
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import catchAsync from './../utils/catchAsync';
import ErrorHandler from './../utils/appError';
import { validateSignUp, validateLogin } from './../utils/validation';
import { CustomReq } from '../models/custom';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN as any) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Valid = validateSignUp.validate(req.body);
    if (Valid.error) {
      return res.status(400).json({
        status: 'fail',
        message: Valid.error?.details[0].message,
      });
    }

    const newUser = await User.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });
    createSendToken(newUser, 201, req, res);
  }
);

exports.login = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    //joi validation
    const Valid = validateLogin.validate(req.body);
    if (Valid.error) {
      return res.status(400).json({
        status: 'fail',
        message: Valid.error?.details[0].message,
      });
    }

    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(ErrorHandler(400, 'Please provide email and password!', {}));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(ErrorHandler(401, 'Incorrect email or password', {}));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  }
);

exports.logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        ErrorHandler(
          401,
          'You are not logged in! Please log in to get access.',
          {}
        )
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        ErrorHandler(
          401,
          'The user belonging to this token does no longer exist.',
          {}
        )
      );
    }

    req.user = currentUser;
    next();
  }
);
