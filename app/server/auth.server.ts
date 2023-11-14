import { redirect, json, createCookieSessionStorage } from '@remix-run/node';
import bcrypt from 'bcryptjs';

import { prisma } from './prisma.server';
import type { RegisterForm, LoginForm } from '../utils/types.server';
import { createUser } from './user.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

/**
 * Create a cookie-based session storage.
 * The session data will be stored in a cookie named 'remix-session'.
 * The cookie settings are defined in the object passed to the function.
 */
const storage = createCookieSessionStorage({
  cookie: {
    name: 'auth-session', // The name of the cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    secrets: [sessionSecret], // The secret key to sign the cookie
    sameSite: 'lax', // Restrict cookie to first-party usage
    path: '/', // The path the cookie is valid for
    maxAge: 60 * 60 * 24, // The cookie's max age in seconds (1 day)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  },
});

/**
 * This function creates a user session and sets a cookie.
 * @param {string} userId - The ID of the user for whom the session is being created.
 * @param {string} redirectTo - The URL to which the user will be redirected after the session is created.
 * @returns {Promise} A Promise that resolves to a redirect response with the 'Set-Cookie' header.
 */
export async function createUserSession(userId: string, redirectTo: string) {
  // Get the current session from the storage
  const session = await storage.getSession();

  // sets the 'userId' of that session to the id of the logged in user
  session.set('userId', userId);

  // Return a redirect response. The 'Set-Cookie' header of the response is set to the committed session.
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

/**
 * This function registers a new user.
 * @param {RegisterForm} user - The user registration form data.
 * @returns {Promise} A Promise that resolves to a JSON response or a user session.
 */
export async function register(user: RegisterForm) {
  // Check if a user already exists with the provided email
  const exists = await prisma.user.count({ where: { email: user.email } });

  // If a user exists, return a JSON response with an error message and a 400 status code
  if (exists) {
    return json(
      { error: `User already exists with that email` },
      { status: 400 }
    );
  }

  // Create a new user with the provided form data
  const newUser = await createUser(user);

  // If the user creation failed, return a JSON response with an error message, the form data, and a 400 status code
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  }

  // If the user was created successfully, create a user session and return it
  return createUserSession(newUser.id, '/');
}

/**
 * This function logs in a user by verifying their email and password.
 * @param {LoginForm} param0 - An object containing the user's email and password.
 * @returns {Promise<Response>} A Promise that resolves to a user session if the login is successful, or a JSON response with an error message if the login fails.
 */
export async function login({ email, password }: LoginForm) {
  // Find the user in the database using the provided email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // If no user is found or the provided password does not match the user's password, return a JSON response with an error message
  if (!user || !(await bcrypt.compare(password, user.password)))
    return json({ error: `Incorrect login` }, { status: 400 });

  // If the login is successful, create a user session and return it
  return createUserSession(user.id, '/');
}

/**
 * This function checks if a user ID exists in the session. If not, it redirects to the login page.
 * @param {Request} request - The incoming request.
 * @param {string} redirectTo - The URL to redirect to if no user ID is found in the session. Defaults to the current URL.
 * @returns {Promise<string>} A Promise that resolves to the user ID if it exists in the session.
 * @throws {Promise<Response>} A Promise that resolves to a redirect response to the login page if no user ID is found in the session.
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  // Get the user session from the request
  const session = await getUserSession(request);

  // Get the user ID from the session
  const userId = session.get('userId');

  // If no user ID is found in the session or the user ID is not a string, redirect to the login page
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  // If a user ID is found in the session, return it
  return userId;
}

/**
 * This function retrieves the user session from the request's cookies.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Session>} A Promise that resolves to the user session.
 */
function getUserSession(request: Request) {
  // Get the 'Cookie' header from the request and retrieve the session from the storage
  return storage.getSession(request.headers.get('Cookie'));
}

/**
 * This function retrieves the user ID from the session. If no user ID is found or it's not a string, it returns null.
 * @param {Request} request - The incoming request.
 * @returns {Promise<string|null>} A Promise that resolves to the user ID if it exists in the session, or null otherwise.
 */
async function getUserId(request: Request) {
  // Get the user session from the request
  const session = await getUserSession(request);

  // Get the user ID from the session
  const userId = session.get('userId');

  // If no user ID is found in the session or the user ID is not a string, return null
  if (!userId || typeof userId !== 'string') return null;

  // If a user ID is found in the session, return it
  return userId;
}

/**
 * This function retrieves the user from the database using the user ID found in the session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<User|null>} A Promise that resolves to the user if found, or null if no user ID is found in the session.
 * @throws {Promise<Response>} A Promise that resolves to a logout response if an error occurs while retrieving the user.
 */
export async function getUser(request: Request) {
  // Get the user ID from the session
  const userId = await getUserId(request);

  // If no user ID is found in the session or the user ID is not a string, return null
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    // Try to find the user in the database using the user ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: true },
    });

    // If the user is found, return it
    return user;
  } catch {
    // If an error occurs while retrieving the user, log out the user
    throw logout(request);
  }
}

/**
 * This function logs out a user by destroying their session.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Response>} A Promise that resolves to a redirect response to the login page, with the 'Set-Cookie' header set to the destroyed session.
 */
export async function logout(request: Request) {
  // Get the user session from the request
  const session = await getUserSession(request);

  // Destroy the session and redirect to the login page
  // The 'Set-Cookie' header of the response is set to the destroyed session
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
