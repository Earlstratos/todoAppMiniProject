const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 50
        },
        body: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date, // Define dueDate as a Date type
            required: true, // If dueDate is required
        },
        user: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
