const PostRepository = require('../repositories/post.repository');
const { Posts } = require('../models/posts');
const { Op } = require('sequelize');

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    try {
      const data = await this.postRepository.findAllPostWithId({
        order: [['createdAt', 'desc']], // 내림차순 정렬
      });
      return { code: 200, data };
    } catch (error) {
      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  findPost = async ({ post_id }) => {
    try {
      const data = await this.postRepository.findPost({ post_id: parseInt(post_id) }); // 숫자로 변환하여 전달

      return { code: 200, data };
    } catch (error) {
      console.error(error);

      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  createPost = async ({ user_id, title, content, subject, image }) => {
    try {
      const data = await this.postRepository.createPost({
        user_id,
        title,
        content,
        subject,
        image,
      });
      return { code: 200, message: '질문 작성이 완료되었습니다.', data };
    } catch (error) {
      console.error(error);

      throw { code: 500, message: '예기치 못한 에러가 발생했습니다.' };
    }
  };

  updatePost = async ({ user_id, post_id, title, content, subject, image }) => {
    try {
      const exPost = await this.postRepository.getPostById(post_id);
      if (exPost.user_id !== user_id) throw new Error('수정 권한이 없습니다.');
      await this.postRepository.updatePost({
        user_id,
        post_id,
        title,
        content,
        subject,
        image,
      });
      return { code: 200, message: '질문 수정이 완료되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  deletePost = async ({ user_id, post_id }) => {
    try {
      const exPost = await this.postRepository.getPostById(post_id);
      if (exPost.user_id !== user_id) throw new Error('삭제 권한이 없습니다.');
      await this.postRepository.deletePost(post_id);
      return { code: 200, message: '질문을 삭제하였습니다.' };
    } catch (error) {
      throw error;
    }
  };

  // 게시글 검색
  async searchPost({ title, content, subject }) {
    const queryOptions = {
      where: {
        [Op.or]: [
          { '$User.userName$': { [Op.like]: `%${title}%` } },
          { content: { [Op.like]: `%${content}%` } },
          { subject: { [Op.like]: `%${subject}%` } },
        ],
        status: 0,
      },
      include: [{ model: this.UserModel, attributes: ['userName'] }],
      limit: 15,
      order: [['post_id', 'DESC']],
    };

    return await this.PostModel.findAll(queryOptions);
  }

  // 게시글 좋아요순 조회
  async getPostOrderByLikes() {
    try {
      return await this.postRepository.getPostOrderByLikes();
    } catch (error) {
      console.error(error);
      throw new Error('서버 오류가 발생했습니다.');
    }
  }
}

module.exports = PostService;
