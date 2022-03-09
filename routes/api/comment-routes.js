const router = require('express').Router();
const { 
    addComment, 
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// Adds comment at /api/comments/<pizzaId>
router
    .route('/:pizzaId')
    .post(addComment);

// Deletes comment or adds reply at /api/comments/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);

// Deletes reply at /api/<pizzaId>/<commentId>/<replyId>
router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;