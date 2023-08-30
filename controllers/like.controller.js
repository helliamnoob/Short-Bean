const LikeService = require('../services/like.service');

class LikeController {
  likeService = new LikeService();

  getLike = async (req, res, next) => {
    try {
      const { post_id } = req.params;
      const { user_id } = res.locals.user;
      const likes = await this.likeService.getLike({ post_id, user_id });

      res.status(200).json({ data: likes });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createLike = async (req, res, next) => {
    try {
      const { post_id } = req.params;
      const { user_id } = res.locals.user;
      const likes = await this.likeService.createLike({ post_id, user_id });

      res.status(201).json({ data: likes });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  destroyLike = async (req, res, next) => {
    try {
      const { post_id } = req.params;
      const { user_id } = res.locals.user;

      const likes = await this.likeService.destroyLike({ post_id, user_id });

      res.status(200).json({ data: likes });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

// 게시글 전체 좋아요 조회
getAllPostLike = async (req, res) => {
  try {
    const allPostLikes = await this.likeService.getAllPostLike();

    // 게시글 좋아요 수 기준으로 내림차순 정렬
    allPostLikes.sort((a, b) => b.likeCount - a.likeCount)

   // 게시글 ID 배열 추출
   const postIds = allPostLikes.map(post => post.post_id);
    
   // 게시글 리스트 조회
   const posts = await this.postService.getPostsByIds(postIds);
   
   // 프론트에 반환할 데이터 형식으로 가공
   const result = posts.map(post => ({
     post_id: post_id,
     title: post.title,
     image: post.image,
     like_count: allPostLikes.find(like => like.post_id === post.id).likeCount
   }));
   
   // 결과 반환
   res.status(200).json({ data: result });
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Internal server error.' });
 }
}
 
}

}
module.exports = LikeController;
