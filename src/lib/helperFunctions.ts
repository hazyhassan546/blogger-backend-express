import jwt from "jsonwebtoken";

export const generateAuthToken = (user: any) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.roleId,
      },
      process.env.JWT_SECRET,
      {
        //   expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: "my-api",
        audience: "my-web-app",
        jwtid: crypto.randomUUID(),
      },
    );
    return token;
  } catch (error) {
    throw new Error("Error generating auth token");
  }
};

export const generateRefreshToken = (user: any) => {
  try {
    const refresh_token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: "my-api",
        audience: "my-web-app",
        jwtid: crypto.randomUUID(),
      },
    );
    return refresh_token;
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
};
