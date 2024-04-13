import clsx from 'clsx';
import React from 'react'; // Ensure React is in scope since you're using JSX.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  const { disabled } = rest;

  return (
    <button
      {...rest}
      className={clsx(
        'h-10 items-center rounded-lg px-4 text-sm font-medium',
        {
          'bg-button-theme text-white hover:bg-button-theme-active': !disabled,
          'bg-gray-400 text-white cursor-not-allowed opacity-50': disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
