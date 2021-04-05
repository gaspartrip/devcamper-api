const moongose = require("mongoose");

const ReviewSchema = new moongose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Name can not be longer than 100 characters"],
  },
  text: {
    type: String,
    required: [true, "Please add a text"],
    maxlength: [500, "Text can not be longer than 500 characters"],
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating"],
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating can not be longer than 10"],
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

ReviewSchema.index(
  {
    bootcamp: 1,
    user: 1,
  },
  { unique: true }
);

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err.red);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = moongose.model("Review", ReviewSchema);
