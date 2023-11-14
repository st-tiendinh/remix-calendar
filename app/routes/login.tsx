import { useState } from 'react'
import { ActionFunction, json } from '@remix-run/node'

import { FormField } from '~/shared/components/FormField'
import loginBg from '../../assets/images/login-bg.jpg'
import { validateEmail, validatePassword } from '~/shared/utils/validators.serve'
import { Form, useActionData } from '@remix-run/react'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get('email')
  const password = form.get('password')
  
  const errors = {
    email: validateEmail(email as string),
    password: validatePassword(password as string),
  }
  if (Object.values(errors).some(Boolean))
    return json({ errors, fields: { email, password } }, { status: 400 })

  return json(form)
}

export default function LoginPage () {
  const actionData = useActionData<typeof action>();
  const [errors] = useState(actionData?.errors || {})
  
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }))
  }

  return <div className="login-page">
    <div className="login-wrapper">
      <div className="login-content-wrapper">
        <div className="login-content">
          <h1 className="login-title">Welcome</h1>
          <h2 className="login-sub-title">We are glad to see you back with us</h2>
          <form className="form login-form" method='post'>
            <FormField  name='email' placeholder='Email' 
              value={formData.email} 
              onChange={(e) => handleInputChange(e,'email')}
              error={errors.email} 
              icon="username"
            />
            <FormField name='password' placeholder='password' 
              type='password'
              value={formData.password} 
              error={errors.password}
              onChange={(e) => 
                handleInputChange(e,'password')
              } 
              icon="password"
            />             
            <button type='submit' className="login-btn">Login</button>
          </form>
        </div>
      </div>
      <div className="login-bg">
        <img src={loginBg} alt="login background" className="login-image" />
      </div>
    </div>
  </div>
}
