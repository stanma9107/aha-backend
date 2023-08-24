import { readFileSync } from 'fs';
import axios from 'axios';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  sub: string;
  sid: string;
}

const getToken = async (code: string) => {
  try {
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
    const decoded = jwt.verify(token, cert) as JwtPayload;
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

const getManagementToken = async () => {
  try {
    const tokenRes = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });
    return {
      isValid: true,
      token: tokenRes.data.access_token,
    };
  } catch (err) {
    return {
      isValid: false,
    };
  }
};

const validatePassword = async (username: string, password: string) => {
  try {
    await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'password',
      client_id: process.env.AUTH0_CLIENT_ID,
      username,
      password,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const changePassword = async (userId: string, password: string) => {
  try {
    const managementToken = await getManagementToken();
    if (managementToken.isValid === false) {
      return false;
    }
    await axios.patch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      password,
      connection: process.env.AUTH0_CONNECTION,
    }, {
      headers: {
        Authorization: `Bearer ${managementToken.token}`,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
};

const decodeToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  return {
    ...decoded,
  };
};

const getSource = (source: string) => {
  switch (source) {
    case 'auth0':
      return 'EMAIL';
    case 'google-oauth2':
      return 'GOOGLE';
    case 'facebook':
      return 'FACEBOOK';
    default:
      return 'EMAIL';
  }
};

const reverseSource = (source: string) => {
  switch (source) {
    case 'EMAIL':
      return 'auth0';
    case 'GOOGLE':
      return 'google-oauth2';
    case 'FACEBOOK':
      return 'facebook';
    default:
      return 'auth0';
  }
};

export default {
  getToken,
  validateToken,
  decodeToken,
  getSource,
  reverseSource,
  validatePassword,
  changePassword,
};
