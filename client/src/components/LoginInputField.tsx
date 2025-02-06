import React from "react";
import { useField, useFormikContext } from "formik";

interface LoginInputFieldProps {
  name: string;
  id: string;
  type?: string;
  className?: string;
  placeholder?: string;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({
  name,
  id,
  type = "text",
  className = "",
  placeholder = "",
}) => {
  const { submitCount } = useFormikContext<any>();
  const [field, meta] = useField(name);
  
  const showError = meta.error && (meta.touched || submitCount > 0);

  return (
    <div className="relative mb-4">
      <input
        {...field}
        id={id}
        type={type}
        placeholder={showError ? meta.error : placeholder} // Show error inside input field
        className={`border bg-pureWhite font-poppins font-medium text-sm px-3 py-[10px] rounded-xl w-full text-primaryDark
          placeholder-placeholder focus:outline-none active:outline-none 
          ${showError ? "border-red-500 text-red-700 placeholder-red-500" : "border-gray-300"}`}
      />
    </div>
  );
};

export default LoginInputField;