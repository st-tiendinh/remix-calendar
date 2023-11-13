import { useState } from 'react'

import { FormField } from '~/components/form-field'
import loginBg from '../../assets/images/login-bg.jpg'

export default function LoginPage () {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
            <div className="form-input-group">
              <i className="icon icon-username"></i>
              <FormField  placeholder='Username' value={formData.username} onChange={(e) => handleInputChange(e,'username')} />
            </div>
            <div className="form-input-group">
              <i className="icon icon-password"></i>
              <FormField placeholder='password' value={formData.password} onChange={(e) => handleInputChange(e,'password')} />             
            </div>
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
