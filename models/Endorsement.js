const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('./Idea')

const EndorsementSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    idea_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Idea',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Endorsement', EndorsementSchema)
