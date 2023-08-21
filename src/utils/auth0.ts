import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';

const validateToken = (token: string) => {
  const cert = readFileSync('./src/assets/public.pem');
  try {
    const decoded = jwt.verify(token, cert);
    return {
      isValid: true,
      decoded,
    };
  } catch (err) {
    return {
      isValid: false,
      decoded: null,
    };
  }
};

export default {
  validateToken,
};
