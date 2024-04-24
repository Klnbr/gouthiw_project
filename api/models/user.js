const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     firstName: {
          type: String,
          required: true,
     },
     lastName: {
          type: String,
          required: true,
     },
     menuBreakfast: [
          {
               menuName: { type: String, ref: 'Menu' },
               purine: { type: Number },
               uric: { type: Number },
               qty: { type: Number, default: 1 }
          }
     ],
     menuLunch: [
          {
               menuName: { type: String, ref: 'Menu' },
               purine: { type: Number },
               uric: { type: Number },
               qty: { type: Number, default: 1 }
          }
     ],
     menuDinner: [
          {
               menuName: { type: String, ref: 'Menu' },
               purine: { type: Number },
               uric: { type: Number },
               qty: { type: Number, default: 1 }
          }
     ],
     purine: {
          type: Number,
          required: true
     },
     uric: {
          type: Number,
          required: true
     },
     isDeleted: {
          type: Boolean,
          default: false, // Set a default value if needed
     }
     
}, { timestamps: true });

const myUser = mongoose.model('User', userSchema)

module.exports = myUser;