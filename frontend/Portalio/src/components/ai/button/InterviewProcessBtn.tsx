import React from "react";

interface ButtonComponentProps {
  label: string;
  icon: string;
  onClick: () => void;
  additionalClasses?: string;
  disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  icon,
  onClick,
  additionalClasses = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md flex items-center space-x-2 ${additionalClasses} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      <i className={`fas fa-${icon}`}></i>
      <span>{label}</span>
    </button>
  );
};

export default ButtonComponent;
