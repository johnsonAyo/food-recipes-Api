import catchAsync from './../utils/catchAsync';
import ErrorHandler from './../utils/appError';
import APIFeatures from './../utils/apiFeatures';
import express, { NextFunction, Request, Response } from 'express';
import { validateEntry } from './../utils/validation';
import { CustomReq } from '../models/custom';

const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(ErrorHandler(404, 'No document found with that ID', {}));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(ErrorHandler(404, 'No document found with that ID', {}));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model: any) =>
  catchAsync(async (req: CustomReq, res: Response, next: NextFunction) => {
    // console.log(req.user)
    const Valid = validateEntry.validate(req.body);
    if (Valid.error) {
      return res.status(400).json({
        status: 'fail',
        message: Valid.error?.details[0].message,
      });
    }

    const fullBody = { ...req.body, user: req.user?._id };

    const doc = await Model.create(fullBody);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model: any, popOptions: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(ErrorHandler(404, 'No document found with that ID', {}));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model: any) =>
  catchAsync(async (req: CustomReq, res: Response, next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query).paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

export { getAll, getOne, updateOne, createOne, deleteOne };
