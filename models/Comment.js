const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema
(
    {
        // Here we'll need a unique identifier instead of the default _id field that is created, so we'll add a custom replyId field. 
        replyId: {
            type: Schema.Types.ObjectId,
            // Despite the custom field name, we're still going to have it generate the same type of ObjectId() value that the _id field typically does.
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema
(
    {
        writenBy: {
            type: String
        },
        commentBody: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // Note that unlike our relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to.
        replies: [ReplySchema] 
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;