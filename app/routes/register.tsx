import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { performMutation } from 'remix-forms';
import { Link, useActionData, useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import { z } from 'zod';
import { InputError, makeDomainFunction } from 'domain-functions';
import { toast } from 'react-hot-toast';

import { getUser, register } from '~/server/auth.server';

import {
  validateEmail,
  validatePassword,
} from '~/shared/utils/validators.server';
import { Form } from '~/shared/components/RemixForm';
import loginBg from '../../assets/images/login-bg.jpg';
import { PASSWORD_REGEX } from '~/shared/constant/validator';
import SvgUsername from '~/shared/components/icons/IcUsername';
import SvgPassword from '~/shared/components/icons/IcPassword';
import SvgEmail from '~/shared/components/icons/IcEmail';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'You are not able to leave email empty' })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(PASSWORD_REGEX, {
      message:
        'Password require uppercase letter, lowercase letter, number, and special symbol',
    }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

const mutation = makeDomainFunction(schema)(async (values) => {
  const email = values.email.trim();
  const password = values.password.trim();
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string'
  ) {
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

  return { email, password, firstName, lastName };
});

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect('/events') : null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const result = await performMutation({
    request,
    schema,
    mutation,
  });

  if (!result.success) return json(result, 400);

  const email = result.data.email;
  const password = result.data.password;
  const firstName = result.data.firstName;
  const lastName = result.data.lastName;

  return await register({ email, password, firstName, lastName });
};

export default function Login() {
  const actionData: any = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    }
  }, [actionData]);

  return (
    <div className="login-page">
      <div className="login-wrapper row">
        <div className="login-content-wrapper col col-6 col-md-12">
          <div className="login-content">
            <h1 className="login-title">LOGIN</h1>
            <h2 className="login-sub-title">Welcome to FE Calendar</h2>
            <Form
              schema={schema}
              className="form login-form form-event"
              method="post"
            >
              {({ Field, Errors, register }) => (
                <>
                  <Field name="firstName" className="form-input-group">
                    {({ Label, Errors }) => (
                      <>
                        <div className="input-icons">
                          <SvgUsername />
                          <input
                            type="text"
                            {...register('firstName')}
                            className="form-input"
                            placeholder="First name"
                            onBlur={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                        </div>
                        <div className="form-error">
                          <Errors />
                        </div>
                      </>
                    )}
                  </Field>

                  <Field name="lastName" className="form-input-group">
                    {({ Label, Errors }) => (
                      <>
                        <div className="input-icons">
                          <SvgUsername />
                          <input
                            type="text"
                            {...register('lastName')}
                            className="form-input"
                            placeholder="Last name"
                            onBlur={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                        </div>
                        <div className="form-error">
                          <Errors />
                        </div>
                      </>
                    )}
                  </Field>

                  <Field name="email" className="form-input-group">
                    {({ Label, Errors }) => (
                      <>
                        <div className="input-icons">
                          <SvgEmail />
                          <input
                            type="email"
                            {...register('email')}
                            className="form-input"
                            placeholder="Email"
                            onBlur={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                        </div>
                        <div className="form-error">
                          <Errors />
                        </div>
                      </>
                    )}
                  </Field>

                  <Field name="password" className="form-input-group">
                    {({ Label, Errors }) => (
                      <>
                        <div className="input-icons">
                          <SvgPassword />
                          <input
                            type="password"
                            {...register('password')}
                            className="form-input"
                            placeholder="Password"
                            onBlur={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                        </div>
                        <div className="form-error">
                          <Errors />
                        </div>
                      </>
                    )}
                  </Field>

                  <Errors className="error-text" />
                  <button
                    className={`btn login-btn ${
                      navigation.state !== 'idle' ? 'loading' : ''
                    }`}
                    disabled={navigation.state !== 'idle' ? true : false}
                  >
                    REGISTER
                  </button>
                  <p className="form-input-helper">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue">
                      Login now
                    </Link>
                  </p>
                </>
              )}
            </Form>
          </div>
        </div>
        <div className="login-bg col col-6 col-md-12">
          <img src={loginBg} alt="login background" className="login-image" />
        </div>
      </div>
    </div>
  );
}
