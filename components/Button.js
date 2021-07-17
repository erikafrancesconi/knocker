import { useState } from "react";

const Button = ({ color, tooltip, title, handleClick }) => {
  const [disabled, setDisabled] = useState(false);

  const manageButtonClick = async () => {
    setDisabled(true);
    await handleClick();
    setDisabled(false);
  };

  return (
    <button
      className={`bg-${color}-800 hover:bg-${color}-500 rounded-md inline-flex items-center py-1 px-2 text-white mr-1`}
      title={tooltip}
      onClick={manageButtonClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
