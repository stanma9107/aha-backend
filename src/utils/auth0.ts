import { readFileSync } from 'fs';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const getToken = async (code: string) => {
  try {
    // throw new Error('test');
    const tokenRes = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: (process.env.ENV === 'development') ? `http://localhost:${process.env.PORT}/auth/callback` : 'https://aha-api.stanma.dev/auth/callback',
    });

    return {
      isValid: true,
      accessToken: tokenRes.data.access_token,
      idToken: tokenRes.data.id_token,
      refreshToken: tokenRes.data.refresh_token,
    };
  } catch (err) {
    return {
      isValid: false,
      accessToken: null,
    };
  }
};

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
  getToken,
  validateToken,
};
