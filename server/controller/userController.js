import User from '../models/userModel.js';

const getUserData = async (req, res) => {
  const userid = req.user.id;

  if (!userid) {
    return res.json({
      success: false,
      message: 'Invalid token',
    });
  }
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default getUserData;
