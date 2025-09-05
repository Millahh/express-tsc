import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Job, { IJob } from "../models/Job";
import { BadRequestError, NotFoundError } from "../errors";

// get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  const jobs: IJob[] = await Job.find({ createdBy: req.user!.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// get a single job
export const getJob = async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const jobId = req.params.id;

  const job: IJob | null = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

// create
export const createJob = async (req: Request, res: Response) => {
  req.body.createdBy = req.user!.userId;
  const job: IJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// update
export const updateJob = async (req: Request, res: Response) => {
  const { company, position } = req.body;
  const userId = req.user!.userId;
  const jobId = req.params.id;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job: IJob | null = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

// delete
export const deleteJob = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const jobId = req.params.id;

  const job: IJob | null = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) throw new NotFoundError(`No job with id ${jobId}`);

  res.status(StatusCodes.OK).send();
};
