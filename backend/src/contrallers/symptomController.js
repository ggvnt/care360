import Symptom from '../models/Symptom.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { diagnosticAlgorithm } from './diagnosisController.js';

export const getAllSymptoms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Symptom.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const symptoms = await features.query;

  res.status(200).json({
    status: 'success',
    results: symptoms.length,
    data: { symptoms }
  });
});

export const getSymptom = catchAsync(async (req, res, next) => {
  const symptom = await Symptom.findById(req.params.id).populate('associatedSymptoms');

  if (!symptom) return next(new AppError('No symptom found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { symptom }
  });
});

export const createSymptom = catchAsync(async (req, res, next) => {
  const { name, description, bodyPart, severity, associatedSymptoms } = req.body;

  // Manual validation before saving
  if (!name || !description || !bodyPart) {
    return next(new AppError('Name, description, and body part are required.', 400));
  }

  const newSymptom = await Symptom.create({
    name,
    description,
    bodyPart,
    severity,
    associatedSymptoms
  });

  res.status(201).json({
    status: 'success',
    data: { symptom: newSymptom }
  });
});


export const updateSymptom = catchAsync(async (req, res, next) => {
  const symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!symptom) return next(new AppError('No symptom found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { symptom }
  });
});

export const deleteSymptom = catchAsync(async (req, res, next) => {
  const symptom = await Symptom.findByIdAndDelete(req.params.id);

  if (!symptom) return next(new AppError('No symptom found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const suggestDiagnosis = catchAsync(async (req, res, next) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return next(new AppError('Please provide an array of symptoms', 400));
  }

  const symptomDetails = await Symptom.find({ _id: { $in: symptoms } });
  const possibleConditions = await diagnosticAlgorithm(symptomDetails);

  res.status(200).json({
    status: 'success',
    data: { possibleConditions }
  });
});
