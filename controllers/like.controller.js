// const LikeService = require('../services/like.service');
// const { Likes } = require('../models');

// class LikeController {
//   likeService = new LikeService();

//   handleError(res, error) {
//     if (error.code) {
//       return res.status(error.code).json({ message: error.message });
//     }
//     console.error(error);
//     return res.status(500).send('알 수 없는 에러가 발생했습니다.');
//   }

//   // 좋아요 조회
//   getLike = async (req, res) => {
//     try {
//       const { user_id } = res.locals.user;
//       const { code, data } = await Likes.findAllLike({
//         where: { user_id },
//         include: [
//           {
//             model: Posts,
//             order: [['likes', 'DESC']],
//             attributes: ['post_id', 'user_id'],
//           },
//         ],
//       });
//       return res.status(code).json({ data });
//     } catch (error) {
//       return this.handleError(res, error);
//     }
//   };

//   // 게시글 좋아요 추가, 취소
//   createLike = async (req, res) => {
//     try {
//       const { user_id } = res.locals.user;
//       const { post_id } = req.params;

//       const like = await Likes.findOne({ where: { post_id, user_id } });
//       const post = await Posts.findOne({ where: { post_id, user_id } });

//       if (like) {
//         await Likes.destory({ where: { post_id, user_id } });
//         await Posts.update({ likes: post.likes - 1 }, { where: { post_id } });
//         res
//           .status(200)
//           .json({ message: '해당 게시글의 좋아요를 취소했습니다.' });
//       } else {
//         await Likes.create({ user_id, post_id });
//         await Posts.update({ likes: post.likes + 1 }, { where: { post_id } });
//         res.status(200).json({ message: '해당 게시글을 좋아요 했습니다.' });
//       }
//     } catch (error) {
//       return this.handleError(res, error);
//     }
//   };
// }

// module.exports = LikeController;
