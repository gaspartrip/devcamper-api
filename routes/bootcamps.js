const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadPhotoForBootcamp,
} = require("../controllers/bootcamps");
const courseRouter = require("./courses");
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(uploadPhotoForBootcamp);

router
  .route("/")
  .get(
    advancedResults(Bootcamp, {
      path: "courses",
      select: "title description tuition",
    }),
    getBootcamps
  )
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
