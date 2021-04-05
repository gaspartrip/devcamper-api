const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId,
    }).populate({
      path: "bootcamp",
      select: "name description",
    });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  }
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get course
 * @route GET /api/v1/courses/:id
 * @access Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    throw new Error("CastError");
  }
  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Create course
 * @route POST /api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user._id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    throw new Error("CastError");
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Not authorized to add a course to this bootcamp", 401)
    );
  }
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

/**
 * @desc Update course
 * @route PUT /api/v1/courses/:id
 * @access Private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    throw new Error("CastError");
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update this course", 401));
  }
  if (req.body.user) {
    delete req.body.user;
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Delete course
 * @route DELETE /api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new Error("CastError");
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to delete this course", 401));
  }
  await course.remove();
  res.status(200).json({ success: true, data: {} });
});
