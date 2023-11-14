import { useEffect, useState } from "react"

interface FormFieldProps {
  name?: string
  type?: string
  value: any
  placeholder ?: string
  onChange?: (...args: any) => any
  error ?: string
  icon : string 
}

export function FormField({ name, placeholder , type = 'text', value, onChange = () => {} , error , icon }: FormFieldProps) {
  const [errorText, setErrorText] = useState(error)

  useEffect(() => {
    setErrorText(error)
  }, [error])
  
  return (
    <div className="form-field">
      <div className="form-input-group">
        <i className={`icon icon-${icon}`}></i>
        <input
          onChange={(e) => { 
            onChange(e)
            setErrorText('')
          }}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className="form-input"
          value={value}
        />
      </div>
      {errorText && <span className="error-text">{errorText}</span>}
    </div>
  )
}
