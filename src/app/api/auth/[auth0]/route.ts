// app/api/auth/[auth0]/route.js
import { handleAuth ,handleCallback } from "@auth0/nextjs-auth0";

// export const GET =  handleAuth({
//   callback: handleCallback((req) => {
//     return { redirectUri: "http://localhost:3000/auth/callback" };
//   }),
// });

// import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// export const GET = handleAuth({
//   async login(req: NextApiRequest, res: NextApiResponse) {
//     const a = await handleLogin(req, res, {
//       returnTo: "/playground",
//     });
//     return NextResponse.json(a);
//   },
// });

// import {
//   handleAuth,
//   handleLogin,
//   handleCallback,
// } from "@auth0/nextjs-auth0/edge";

// const redirectUri = `${process.env.AUTH0_BASE_URL}/auth/callback`;

// export const GET = handleAuth({
//   login: handleLogin({
//     authorizationParams: { redirect_uri: redirectUri },
//   }),
//   callback: handleCallback({ redirectUri }),
//   onError(req: Request, error: Error) {
//     console.error(error);
//   },
// });

// export const runtime = "edge";
// //https://github.com/vercel/next.js/issues/51642
// export const fetchCache = "force-no-store";

// pages/api/auth/[auth0].js
// import { handleAuth, handleLogin, handleProfile } from '@auth0/nextjs-auth0';
// const redirectUri = `${process.env.AUTH0_BASE_URL}/auth/callback`;

// export default handleAuth({
//   async login(req: NextApiRequest, res: NextApiResponse) {
//     // Add your own custom logger
//     // Pass custom parameters to login
//     await handleLogin(req, res, {
//       authorizationParams: {
//         custom_param: "custom",
//       },
//       returnTo: redirectUri,
//     });
//   },
//   invite: handleLogin({
//     authorizationParams: {
//       invitation: req.query.invitation,
//     },
//   }),
//   "login-with-google": handleLogin({
//     authorizationParams: { connection: "google" },
//   }),
//   "refresh-profile": handleProfile({ refetch: true }),
//   onError(req, res, error) {
//     // Add your own custom error handling
//     res.status(error.status || 400).end();
//   },
// });


// export const GET =  handleAuth({
//   async callback(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       // Complete the Auth0 login flow
//       await handleCallback(req, res);

//       // After successful login, redirect to the custom callback page
//       res.writeHead(302, { Location: "/auth/callback" });
//       res.end();
//     } catch (error) {
//       console.error(error);
//       res.status(500).end("Authentication failed");
//     }
//   },
// });

export const GET = handleAuth();