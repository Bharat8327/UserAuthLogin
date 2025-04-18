import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({
      success: false,
      message: 'Not Authorized. Login again',
    });
  }

  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    if (!verify) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
    }

    req.user = { id: verify.id };

    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// export const fetchData = async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return res.json({
//       success: false,
//       message: 'Not Authorized. Login again',
//     });
//   }

//   try {
//     const verify = jwt.verify(token, process.env.SECRET_KEY);
//     if (!verify) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not Authorized. Login Again',
//       });
//     }

//     req.user = {
//       id: verify.id,
//     };
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: 'Unauthorized',
//       error: error.message,
//     });
//   }
// };

export default userAuth;
