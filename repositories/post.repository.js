const { Posts, Users } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  constructor(PostModel, UserModel) {
    this.PostModel = PostModel; // 생성자에서 모델을 받아옴
    this.UserModel = UserModel; // 생성자에서 모델을 받아옴
  }

  findAllPostWithId = async () => {
    // include Users 생략할까? 결과값이 쓸데없이 자세한 것 같은데..
    return await Posts.findAll({
      include: [{ model: Users }],
      order: [['updatedAt', 'DESC']],
      attributes: ['post_id', 'title', 'content', 'subject'],
    });
  };

  findPost = async ({ post_id }) => {
    return await Posts.findOne({ where: { post_id: parseInt(post_id) } });
  };

  createPost = async ({ user_id, title, content, subject, image }) => {
    return await Posts.create({ user_id, title, content, subject, image });
  };

  updatePost = async ({ user_id, post_id, title, content, subject, image }) => {
    return await Posts.update(
      { title, content, subject, image },
      { where: { [Op.and]: [{ user_id }, { post_id }] } }
    );
  };

  deletePost = async ({ user_id, post_id }) => {
    return await Posts.destroy({
      where: { [Op.and]: [{ user_id }, { post_id }] },
    });
  };

  updatePostLike = async ({ post_like, post_id }) => {
    return await Posts.update({ post_like }, { where: { post_id: parseInt(post_id) } });
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

  // // 게시글 좋아요순 조회
  // async getPostOrderByLikes() {
  //   try {
  //     return await Posts.findAll({
  //       order: [['post_like', 'DESC']], // 'post_like' 필드를 기준으로 내림차순 정렬
  //     });
  //   } catch (error) {
  //     throw { code: 500, message: '서버 오류가 발생했습니다.' };
  //   }
  // }
}

module.exports = PostRepository;
