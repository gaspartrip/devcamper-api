const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: "courses",
    select: "title description tuition",
  });
  if (!bootcamp) {
    throw new Error("CastError");
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    throw new Error("CastError");
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new Error("CastError");
  }
  await bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  //Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.uploadPhotoForBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    throw new Error("CastError");
  }
  if (!req.files) {
    throw new Error("FileError");
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new Error("ImageError");
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new Error("MaxFileUploadError");
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      throw new Error();
    }
  });
  await Bootcamp.findByIdAndUpdate(
    req.params.id,
    { photo: file.name },
    {
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: file.name });
});
