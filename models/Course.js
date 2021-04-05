const moongose = require("mongoose");

const CourseSchema = new moongose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [50, "Name can not be longer than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be longer than 500 characters"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: moongose.Schema.ObjectId,
    required: true,
    ref: "Bootcamp",
  },
  user: {
    type: moongose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil((obj[0].averageCost / 10) * 10),
    });
  } catch (err) {
    console.log(err.red);
  }
};

CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.post("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = moongose.model("Course", CourseSchema);
