import httpStatus from 'http-status';
import { UserAttributes } from 'src/models/user.model';
import { User } from '../models';
import ApiError from '../utils/ApiError';

export const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

export const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

export const getUserById = async (id: number | string) => {
  return await User.findByPk(id);

};

export const getUserByEmail = async (email: string): Promise<UserAttributes> => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user.get({ plain: true });
};

export const updateUserById = async (userId: number | string, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
export const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.destroy({ where: { user_id: userId }, });
  return user;
};
