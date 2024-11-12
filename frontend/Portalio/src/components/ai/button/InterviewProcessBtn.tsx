import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonComponentProps {
  label: string;
  icon: IconDefinition; // Font Awesome 아이콘 객체 타입
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
      <FontAwesomeIcon icon={icon} className="mr-2" /> {/* FontAwesomeIcon 컴포넌트를 사용하여 아이콘 렌더링 */}
      <span>{label}</span>
    </button>
  );
};

export default ButtonComponent;
