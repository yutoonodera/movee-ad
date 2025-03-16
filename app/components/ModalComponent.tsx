import React from "react";
import { Modal, Button } from "antd";

interface ModalComponentProps {
  title: string;
  text: string;
  link: string;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  handleNavigate: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  text,
  link,
  isModalVisible,
  setIsModalVisible,
  handleNavigate,
}) => {
  const handleClose = () => setIsModalVisible(false);

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          閉じる
        </Button>,
        <Button key="go" type="primary" onClick={handleNavigate}>
          詳細ページへ移動
        </Button>,
      ]}
    >
      <p>{text}</p>
    </Modal>
  );
};

export default ModalComponent;
