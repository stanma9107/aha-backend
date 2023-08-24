import { FastifyReply, FastifyRequest } from 'fastify';
import { UserSource } from '@prisma/client';
import auth0 from '../../utils/auth0';
import {
  badRequest,
  forbidden,
  internalServerError,
  success,
} from '../../utils/response';

export default async (req: FastifyRequest<{
  Body: {
    oldPassword: string;
    newPassword: string;
    newPasswordAgain: string;
  };
}>, res: FastifyReply) => {
  const { user } = req;

  const { oldPassword, newPassword, newPasswordAgain } = req.body;

  // check all fields are filled
  if (!oldPassword || !newPassword || !newPasswordAgain) {
    return badRequest(res, 'Please fill all fields');
  }

  // check newPasswords are same
  if (newPassword !== newPasswordAgain) {
    return badRequest(res, 'New passwords are not same');
  }

  // check user login source
  if (user.source !== UserSource.EMAIL || !user.email) {
    return forbidden(res, 'You cannot change password');
  }

  // check oldPassword is correct
  const isPasswordCorrect = await auth0.validatePassword(user.email, oldPassword);
  if (!isPasswordCorrect) {
    return badRequest(res, 'Old password is incorrect');
  }

  // check newPassword is strong enough
  const lowercaseRegex = /.*[a-z].*/;
  const uppercaseRegex = /.*[A-Z].*/;
  const numberRegex = /.*[0-9].*/;
  const specialCharacterRegex = /.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?].*/;

  // check lowercase
  if (!lowercaseRegex.test(newPassword)) {
    return badRequest(res, 'Password must contain at least one lowercase letter');
  }

  // check uppercase
  if (!uppercaseRegex.test(newPassword)) {
    return badRequest(res, 'Password must contain at least one uppercase letter');
  }

  // check number
  if (!numberRegex.test(newPassword)) {
    return badRequest(res, 'Password must contain at least one number');
  }

  // check special character
  if (!specialCharacterRegex.test(newPassword)) {
    return badRequest(res, 'Password must contain at least one special character');
  }

  // check length
  if (newPassword.length < 8) {
    return badRequest(res, 'Password must contain at least 8 characters');
  }

  // change password
  const isPasswordChanged = await auth0.changePassword(`${auth0.reverseSource(user.source)}|${user.auth0_id}`, newPassword);
  if (!isPasswordChanged) {
    return internalServerError(res, 'Password could not be changed');
  }

  // send response
  return success(res, 'Password changed successfully.');
};
