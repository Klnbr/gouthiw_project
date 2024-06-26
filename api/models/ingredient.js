const mongoose = require('mongoose');

const ingreSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     purine: {
          type: Number
     },
     uric: {
          type: Number
     },
     isDeleted: {
          type: Boolean,
          default: false, // Set a default value if needed
     },
}, { timestamps: true });

const myIngr = mongoose.model('ingr', ingreSchema);

module.exports = myIngr;
