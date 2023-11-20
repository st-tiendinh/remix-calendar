import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { performMutation } from 'remix-forms';
import { useActionData } from '@remix-run/react';
import { useEffect } from 'react';
import { z } from 'zod';
import { InputError, makeDomainFunction } from 'domain-functions';
import { toast } from 'react-hot-toast';

import { login, getUser } from '~/server/auth.server';
import { validateEmail, validatePassword } from '~/shared/utils/validators.server';
import { Form } from '~/shared/components/form';
import loginBg from '../../assets/images/login-bg.jpg';
import { PASSWORD_REGEX } from '~/shared/constant/validator';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'You are not able to leave email empty' })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(
      PASSWORD_REGEX,
      {
        message:
          'Password require uppercase letter, lowercase letter, number, and special symbol',
      }
    ),
});

const mutation = makeDomainFunction(schema)(async (values) => {
  const email = values.email.trim();
  const password = values.password.trim();

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw 'Invalid Form Data';
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email) {
    throw new InputError('Invalid email', 'email');
  }

  if (errors.password) {
    throw new InputError('Invalid password', 'password');
  }

  return { email, password };
});

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect('/event') : null;
};

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({
    request,
    schema,
    mutation,
  });

  if (!result.success) return json(result, 400);

  const email = result.data.email;
  const password = result.data.password;

  return await login({ email, password });
};

export default function Login() {
  const actionData: any = useActionData();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    }
  }, [actionData]);

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-content-wrapper">
          <div className="login-content">
            <h1 className="login-title">Welcome</h1>
            <h2 className="login-sub-title">
              We are glad to see you back with us
            </h2>
            <Form schema={schema} className="form login-form" method="post">
              {({ Field, Errors, Button, register }) => (
                <>
                  <div className="form-field">
                    <Field name="email">
                      {({ Label, Errors }) => (
                        <div className="form-input-group">
                          <i className={`icon icon-username`}></i>
                          <input
                            type="email"
                            {...register('email')}
                            className="form-input"
                            placeholder="Email"
                            onBlur={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                          <div className="error-text">
                            <Errors />
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className="form-field">
                    <div className="form-input-group">
                      <Field name="password">
                        {({ Label, Errors }) => (
                          <>
                            <i className={`icon icon-password`}></i>
                            <input
                              type="password"
                              {...register('password')}
                              className="form-input"
                              placeholder="Password"
                              onBlur={(e) => {
                                e.target.value = e.target.value.trim();
                              }}
                            />
                            <div className="error-text">
                              <Errors />
                            </div>
                          </>
                        )}
                      </Field>
                    </div>
                  </div>
                  <Errors className="error-text" />
                  <Button className="login-btn" />
                </>
              )}
            </Form>
          </div>
        </div>
        <div className="login-bg">
          <img src={loginBg} alt="login background" className="login-image" />
        </div>
      </div>
    </div>
  );
}
