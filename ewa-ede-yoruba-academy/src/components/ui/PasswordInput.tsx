'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showStrengthIndicator?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  required = false,
  className = "",
  showStrengthIndicator = false,
  onValidationChange
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const valid = minLength && hasUppercase && hasNumber && hasSymbol;
    setIsValid(valid);
    onValidationChange?.(valid);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (showStrengthIndicator) {
      validatePassword(e.target.value);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: 'text-red-500' };
    if (score <= 2) return { level: 2, text: 'Fair', color: 'text-yellow-500' };
    if (score <= 3) return { level: 3, text: 'Good', color: 'text-blue-500' };
    return { level: 4, text: 'Strong', color: 'text-green-500' };
  };

  const strength = getPasswordStrength(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          className={`block w-full px-3 py-2 pr-10 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] ${className}`}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#a1a1aa] hover:text-white"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {showStrengthIndicator && value && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.level === 1 ? 'bg-red-500 w-1/4' :
                  strength.level === 2 ? 'bg-yellow-500 w-2/4' :
                  strength.level === 3 ? 'bg-blue-500 w-3/4' :
                  'bg-green-500 w-full'
                }`}
              />
            </div>
            <span className={`text-sm font-medium ${strength.color}`}>
              {strength.text}
            </span>
          </div>

          <div className="text-xs text-[#a1a1aa] space-y-1">
            <div className={`flex items-center ${value.length >= 8 ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
              <span className="mr-2">✓</span>
              At least 8 characters
            </div>
            <div className={`flex items-center ${/[A-Z]/.test(value) ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
              <span className="mr-2">✓</span>
              One uppercase letter
            </div>
            <div className={`flex items-center ${/\d/.test(value) ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
              <span className="mr-2">✓</span>
              One number
            </div>
            <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
              <span className="mr-2">✓</span>
              One special character
            </div>
          </div>
        </div>
      )}
    </div>
  );
}