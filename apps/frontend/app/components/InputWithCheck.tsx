interface InputWithCheckProps {
  type: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export function InputWithCheck({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  className = '',
  style,
  ...props
}: InputWithCheckProps) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 focus:outline-none border border-gray-200 focus:border-black ${className}`}
        style={style}
        {...props}
      />
    </div>
  );
}
