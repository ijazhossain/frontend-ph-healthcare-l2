/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const decode = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decode,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

const decodeToken = (token: string) => {
  const decode = jwt.decode(token) as JwtPayload;
  return decode;
};

export const jwtUtils = {
  verifyToken,
  decodeToken,
};
