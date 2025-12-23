import { ButtonHTMLAttributes, ReactNode } from 'react';
import { SejongColors } from '@/styles/colors';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: `
    text-white
    hover:opacity-90
    active:scale-95
  `,
  secondary: `
    text-white
    hover:opacity-90
    active:scale-95
  `,
  outline: `
    bg-transparent
    border-2
    hover:bg-opacity-5
    active:scale-95
  `,
  ghost: `
    bg-transparent
    hover:bg-gray-100
    active:scale-95
  `
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const styleConfig = {
  primary: {
    backgroundColor: SejongColors.primary,
    borderColor: 'transparent',
    color: '#FFFFFF',
    borderWidth: '0'
  },
  secondary: {
    backgroundColor: SejongColors.secondary,
    borderColor: 'transparent',
    color: '#FFFFFF',
    borderWidth: '0'
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: SejongColors.primary,
    color: SejongColors.primary,
    borderWidth: '2px'
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: SejongColors.primary,
    borderWidth: '0'
  }
};

const baseStyles = `
  inline-flex items-center justify-center gap-2
  rounded-lg font-medium
  transition-all duration-200
  cursor-pointer
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-offset-2
`;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={styleConfig[variant]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl'
};

const iconStyleConfig = {
  primary: {
    backgroundColor: SejongColors.primary,
    color: '#FFFFFF'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: SejongColors.text.primary
  }
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-full
        transition-all duration-200
        cursor-pointer
        hover:scale-110
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${iconSizeClasses[size]}
        ${variant === 'primary' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}
        ${className}
      `}
      style={iconStyleConfig[variant]}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
