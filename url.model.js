const mongoose = require('mongoose');
const shortid = require("shortid");

const urlSchema = new mongoose.Schema({
    original_url: {
      type: String,
      required: true
    },
    short_url: {
      type: String,
      required: true,
      default: shortid.generate
    }
  });
  
  module.exports = mongoose.model("Url", urlSchema);