const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Private/admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get user
 * @route GET /api/v1/users/:id
 * @access Private/admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("CastError");
  }
  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Create user
 * @route POST /api/v1/users
 * @access Private/admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

/**
 * @desc Update user
 * @route PUT /api/v1/users/:id
 * @access Private/admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("CastError");
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Delete user
 * @route DELETE /api/v1/users/:id
 * @access Private/admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("CastError");
  }
  user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("CastError");
  }
  await user.remove();
  res.status(200).json({ success: true, data: {} });
});
