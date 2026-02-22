import { forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface GoogleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const GoogleInput = forwardRef<HTMLInputElement, GoogleInputProps>(
  ({ label, error, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full mb-1">
        <div className="relative">
          <input
            ref={ref}
            type={actualType}
            {...props}
            className={`
              peer w-full h-14 rounded border px-4 pt-5 pb-1 text-base focus:outline-none transition-all placeholder-transparent bg-transparent z-10 relative
              ${
                error
                  ? "border-[#d93025] focus:border-[#d93025] focus:border-2"
                  : "border-gray-400 focus:border-[#0b57d0] focus:border-2 hover:border-gray-800 focus:hover:border-[#0b57d0]"
              }
            `}
            placeholder={label}
          />
          <label
            className={`
              absolute left-3 top-4 text-base transition-all pointer-events-none bg-white px-1 z-0
              peer-placeholder-shown:text-base peer-placeholder-shown:top-4
              peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:bg-white
              -translate-y-6 text-xs
              ${
                error
                  ? "text-[#d93025] peer-focus:text-[#d93025]"
                  : "text-gray-600 peer-focus:text-[#0b57d0]"
              }
            `}
          >
            {label}
          </label>
        </div>

        {isPassword && (
          <div className="mt-3 flex items-center">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-800 hover:text-black">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-sm border-gray-400 text-[#0b57d0] focus:ring-[#0b57d0]"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
          </div>
        )}

        {error && (
          <div className="text-[#d93025] text-xs mt-2 ml-1 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

GoogleInput.displayName = "GoogleInput";
