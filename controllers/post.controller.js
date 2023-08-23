const PostService = require('../services/post.service');
const { Posts } = require('../models');

class PostController {
  postService = new PostService();

  handleError(res, error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).send('알 수 없는 에러가 발생했습니다.');
  }

  // 게시글 전체 조회
  getAllPost = async (req, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: '인증 정보가 필요합니다.' });
      }
      const { code, data } = await this.postService.findAllPost();

      if (code === 404) {
        res.status(404).json({ errorMessage: '존재하는 게시글이 없습니다.' });
      }
      return res.status(code).json({ data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 게시글 상세 조회
  getPost = async (req, res) => {
    const { post_id } = req.params;
    try {
      const { code, data } = await this.postService.findPost({ post_id });

      if (code === 404) {
        res.status(404).json({ errorMessage: '존재하는 게시글이 없습니다.' });
      }
      return res.status(code).json({ data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 게시글 생성
  createPost = async (req, res) => {
    try {
      const { content, subject } = req.body;
      const { user_id } = res.locals.user;

      if (!content || !subject) {
        return res
          .status(400)
          .json({ error: '질문 내용, 과목 기입은 필수입니다.' });
      }

      const { code, message } = await this.postService.createPost({
        content,
        subject,
        user_id,
      });

      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 게시글 수정
  updatePost = async (req, res) => {
    try {
      const { content, subject } = req.body;
      const { user_id } = res.locals.user;
      const { post_id } = req.params;

      if (!content && !subject) {
        return res.status(400).json({ error: '수정할 내용이 없습니다.' });
      }

      const { code, message } = await this.postService.updatePost({
        content,
        subject,
        user_id,
        post_id,
      });

      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 게시글 삭제
  deletePost = async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = res.locals.user;

      if (!post_id) {
        return res.status(400).json({ error: '게시글 ID가 필요합니다.' });
      }

      const { code, message } = await this.postService.deletePost({
        post_id,
        user_id,
      });

      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = PostController;
