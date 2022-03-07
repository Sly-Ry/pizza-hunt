const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    writenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Data,
        default: Date.now
    }
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;