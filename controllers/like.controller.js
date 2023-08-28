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
}
module.exports = LikeController;
