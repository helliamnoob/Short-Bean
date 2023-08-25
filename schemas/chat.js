const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room_id: {
    type: Number,
    required: true,
  },
  is_send: {
    type: Boolean,
    required: true,
  },
  message_content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
