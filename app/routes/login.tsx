import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { useState } from 'react';
import { login, register, getUser } from '~/server/auth.server';
import { FormField } from '~/shared/components/FormField';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '~/utils/validators.server';
import loginBg from '../../assets/images/login-bg.jpg';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('_action');
  const email = form.get('email');
  const password = form.get('password');
  let firstName = form.get('firstName');
  let lastName = form.get('lastName');

  if (
    typeof action !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === 'register' &&
    (typeof firstName !== 'string' || typeof lastName !== 'string')
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === 'register'
      ? {
          firstName: validateName((firstName as string) || ''),
          lastName: validateName((lastName as string) || ''),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );

  switch (action) {
    case 'login': {
      return await login({ email, password });
    }
    case 'register': {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect('/') : null;
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [errors] = useState(actionData?.errors || {});

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  const handleSubmit = (e: any) => {
    if (errors) {
      e.preventDefault();
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-content-wrapper">
          <div className="login-content">
            <h1 className="login-title">Welcome</h1>
            <h2 className="login-sub-title">
              We are glad to see you back with us
            </h2>
            <form className="form login-form" method="post">
              <FormField
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange(e, 'email')}
                error={errors.email}
                icon="username"
              />
              <FormField
                name="password"
                placeholder="password"
                type="password"
                value={formData.password}
                error={errors.password}
                onChange={(e) => handleInputChange(e, 'password')}
                icon="password"
              />
              <button
                type="submit"
                className="login-btn"
                onSubmit={handleSubmit}
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="login-bg">
          <img src={loginBg} alt="login background" className="login-image" />
        </div>
      </div>
    </div>
  );
}
