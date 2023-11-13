interface FormFieldProps {
  htmlFor?: string
  label?: string
  type?: string
  value: any
  placeholder ?: string
  onChange?: (...args: any) => any
}

export function FormField({ htmlFor, label, placeholder , type = 'text', value, onChange = () => {} }: FormFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        placeholder={placeholder}
        className="form-input"
        value={value}
      />
    </>
  )
}
