const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  trainTime:{
    type: Number,
    required: true
  },
  platformNumber: {
    type: Number,
    required: true
  },
  carriageNumber: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default:Date.now
  },
  
  updatedAt: {
    type: Date,
    default:Date.now
  }


});

module.exports = mongoose.model('Post', PostSchema);