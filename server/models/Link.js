const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let LinkModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  favorite: {
    type: String,
    default: 'unknown',
  },
  leastFavorite: {
    type: String,
    default: 'unknown',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

LinkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  favorite: doc.favorite,
  leastFavorite: doc.leastFavorite,
});

LinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LinkModel.find(search).select('name age favorite leastFavorite').lean().exec(callback);
};

LinkModel = mongoose.model('Link', LinkSchema);

module.exports.LinkModel = LinkModel;
module.exports.LinkSchema = LinkSchema;
