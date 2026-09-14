const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 3,
      trim: true,
    },

    email: {
  type: String,
  required: true,
  unique: true,
  validate: {
  validator: function (value) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  },
  message: "Invalid email format",
},
},

  password: {
     type: String,
    required: true,
     minlength: 6,
  },
    role: {
      type: String,
      enum: ["driver", "owner", "admin"],
      default: "driver",
    },

    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
//post بتمسك الداتا بتاعتى بعد ما يحصل عليها التعديل
//async and return .then or await /async
// const saltRounds = 16;

// userSchema.pre("save", function () {
//     bcrypt.genSalt(saltRounds)
//         .then((salt) => {
//             return bcrypt.hash(this.password, salt);
//         })
//         .then((hashedPassword) => {
//             this.password = hashedPassword;
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

//async
// const saltRounds = 16;

// userSchema.pre("save", async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(saltRounds);
//         this.password = await bcrypt.hash(this.password, salt);

//         next();
//     } catch (err) {
//         next(err);
//     }
// });
// userSchema.pre("save", async function () {
//     const salt = await bcrypt.genSalt(16);
//     this.password = await bcrypt.hash(this.password, salt);
// });
module.exports = mongoose.model("User", userSchema);