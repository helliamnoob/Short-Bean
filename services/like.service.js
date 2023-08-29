const LikeRepository = require('../repositories/like.repository');
const PostRepository = require('../repositories/post.repository');

class LikeService {
  likeRepository = new LikeRepository();
  postRepository = new PostRepository();

  getLike = async (post_id) => {
    const getLikeData = await this.likeRepository.findLike(post_id);
    return getLikeData;
  };

  createLike = async ({ post_id, user_id }) => {
    const post = await this.postRepository.findPost({ post_id });
    const like = await this.likeRepository.findLike({ post_id, user_id });
    console.log('like:', like);
    if (!post) {
      return res.status(404).json({
        success: false,
        errorMessage: '해당 게시글을 찾을 수 없습니다.',
      });
    } else {
      if (!like) {
        await this.likeRepository.createLike({
          post_id,
          user_id,
        });
        await this.postRepository.updatePostLike({ post_like: post.post_like + 1, post_id });
        console.log('좋아요');
        return like;
      } else {
        await this.postRepository.updatePostLike({ post_like: post.post_like - 1, post_id });

        await this.likeRepository.destoryLike({ post_id, user_id });
        console.log('좋아요취소');
        return like;
      }
    }
  };
}
module.exports = LikeService;
