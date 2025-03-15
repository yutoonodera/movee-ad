import { Button } from "antd";

interface SelectionButtonsProps {
  activeButton: string;
  handleButtonClick: (buttonName: string) => void;
}

const SelectionButtons: React.FC<SelectionButtonsProps> = ({ activeButton, handleButtonClick }) => {
  return (
    <div className="flex justify-center w-full mb-6 space-x-4">
      <Button type={activeButton === "all" ? "primary" : "default"} onClick={() => handleButtonClick("all")}>
        オール
      </Button>
      <Button type={activeButton === "tech" ? "primary" : "default"} onClick={() => handleButtonClick("tech")}>
        テック
      </Button>
      <Button type={activeButton === "finance" ? "primary" : "default"} onClick={() => handleButtonClick("finance")}>
        会計
      </Button>
    </div>
  );
};

export default SelectionButtons;
