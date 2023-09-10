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

      const rows = data.map((post) => ({
        title: post.title,
        content: post.content,
        subject: post.subject,
        post_id: post.post_id,
      }));
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

      // if (isNaN(parsed_post_id)) {
      //   // 숫자로 변환되지 않은 경우 처리
      //   return res.status(400).json({ errorMessage: '유효하지 않은 post_id입니다.' });
      // }

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

      let filePath = req.files && req.files[0] ? req.files[0].location : null;
      const image = filePath ? `<img src="${filePath}" class="image" alt="질문 이미지"/>` : '';

      if (!title || !content || !subject) {
        return res.status(400).json({ error: '질문의 제목과 질문 내용, 과목 기입은 필수입니다.' });
      }

      const { code, message, data } = await this.postService.createPost({
        title,
        content,
        subject,
        user_id,
        image: filePath, //   이 HTML 태그 전체가 이미지의 경로로 사용되기 때문에 웹 브라우저에서 이미지를 로드할 수 없기 떄문에 filePath 사용? 58번째 라인 참고
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

      let filePath = req.files && req.files[0] ? req.files[0].location : null;
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
        image: filePath,
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

  // 게시글 검색
  searchPost = async (req, res) => {
    try {
      const { title, content, subject } = req.body;
      // 요청 데이터 검증 (필요에 따라 추가적인 검증이 필요할 수 있음)
      if (!title && !content && !subject) {
        return res.status(400).json({ message: '검색어를 제공하세요.' });
      }

      const data = await this.postService.searchPost({ title, content, subject });

      // 검색 결과가 없을 경우 처리 (필요에 따라 추가적인 처리가 필요할 수 있음)
      if (!data || data.length === 0) {
        return res.status(404).json({ message: '검색 결과가 없습니다.' });
      }

      return res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
  };

  // // 게시글 좋아요순 조회
  // getPostOrderByLikes = async (req, res) => {
  //   try {
  //     const posts = await this.postService.getPostOrderByLikes();
  //     res.json(posts);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(error.code || 500).json({ message: error.message || '서버 오류가 발생했습니다.' });
  //   }
  // };
}

module.exports = PostController;
