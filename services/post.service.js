const PostRepository = require('../repositories/post.repository');
const { Posts } = require('../models');

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    try {
      const data = await this.postRepository.findAllPost({
        order: [['createdAt', 'desc']], // 내림차순 정렬
      });
      return { code: 200, data };
    } catch (error) {
      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  findPost = async ({ postId }) => {
    try {
      const data = await this.postRepository.findPost({ postId });
      return { code: 200, data };
    } catch (error) {
      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  createPost = async ({ userId, image, content, subject }) => {
    try {
      await this.postRepository.createPost({
        userId,
        image,
        content,
        subject,
      });
      return { code: 200, message: '질문 작성이 완료되었습니다.' };
    } catch (error) {
      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  updatePost = async ({ userId, postId, image, content, subject }) => {
    try {
      await this.postRepository.updatePost({
        userId,
        postId,
        image,
        content,
        subject,
      });
      return { code: 200, message: '질문 수정이 완료되었습니다.' };
    } catch (error) {
      throw { code: 400, message: '데이터 형식이 올바르지 않습니다.' };
    }
  };

  deletePost = async ({ userId, postId }) => {
    try {
      await this.postRepository.deletePost({ postId, userId });
      return { code: 200, message: '질문을 삭제하였습니다.' };
    } catch (error) {
      throw { code: 400, message: '데이터 형식이 올바르지 않습니다.' };
    }
  };
}

module.exports = PostService;
