const PostService = require('../services/post.service');
const { Posts } = require('../models/posts');

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
    try {
      const { post_id } = req.params;

      const parsed_post_id = parseInt(post_id); // post_id 값을 숫자로 변환

      if (isNaN(parsed_post_id)) {
        // 숫자로 변환되지 않은 경우 처리
        return res.status(400).json({ errorMessage: '유효하지 않은 post_id입니다.' });
      }

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
      const { title, content, subject } = req.body;
      const { user_id } = res.locals.user;

      let filePath = req.file ? req.file.location : null;
      const image = filePath ? `<img src="${filePath}" class="image" alt="질문 이미지"/>` : '';

      if (!title || !content || !subject) {
        return res.status(400).json({ error: '질문의 제목과 질문 내용, 과목 기입은 필수입니다.' });
      }

      const { code, message, data } = await this.postService.createPost({
        title,
        content,
        subject,
        user_id,
        image,
      });

      return res.status(code).json({ message, data });
    } catch (error) {
      console.error(error);

      return this.handleError(res, error);
    }
  };

  // 게시글 수정
  updatePost = async (req, res) => {
    try {
      const { title, content, subject } = req.body;
      const { user_id } = res.locals.user;
      const { post_id } = req.params;

      let filePath = req.file ? req.file.location : null;
      const image = filePath ? `<img src="${filePath}" class="image" alt="질문 이미지"/>` : '';

      if (!content || !subject) {
        return res.status(400).json({ error: '수정할 내용이 없습니다.' });
      }

      const { code, message } = await this.postService.updatePost({
        title,
        content,
        subject,
        user_id,
        post_id,
        image,
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

      if (post_id !== req.body.requested_post_id) {
        return res.status(400).json({ error: '올바른 게시글 ID가 아닙니다.' });
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
