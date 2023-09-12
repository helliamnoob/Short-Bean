const { Posts, Users } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  constructor(PostModel, UserModel) {
    this.PostModel = PostModel; // 생성자에서 모델을 받아옴
    this.UserModel = UserModel; // 생성자에서 모델을 받아옴
  }

  findAllPostWithId = async () => {
    return await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ['nickname'], // 가져올 Users 모델의 속성을 지정
        },
      ],
      order: [['createdAt', 'DESC']],
      attributes: ['post_id', 'title', 'content', 'subject', 'image'],
    });
  };

  findPost = async ({ post_id }) => {
    return await Posts.findOne({ where: { post_id: parseInt(post_id) } });
  };

  createPost = async ({ user_id, title, content, subject, image }) => {
    return await Posts.create({ user_id, title, content, subject, image });
  };

  updatePost = async ({ user_id, post_id, title, content, subject, image }) => {
    return await Posts.update({ title, content, subject, image }, { where: { post_id } });
  };

  deletePost = async (post_id) => {
    return await Posts.destroy({
      where: { post_id },
    });
  };

  getPostById = async (post_id) => {
    return await Posts.findOne({
      where: { post_id },
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

  // 게시글 좋아요순 조회
  async getPostOrderByLikes() {
    try {
      const posts = await Posts.findAll({
        include: [
          {
            model: Users,
            attributes: ['nickname'], // 가져올 Users 모델의 속성을 지정
          },
        ],
        order: [['post_like', 'DESC']], // 'post_like' 필드를 기준으로 내림차순 정렬
      });
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error('데이터 조회 중에 오류가 발생했습니다.');
    }
  }
}

module.exports = PostRepository;
