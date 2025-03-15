import React from "react";
import { Modal, Button } from "antd";

interface ModalComponentProps {
  title: string;
  text: string;
  link: string;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  handleNavigate: () => void;
  activeButton: string; // activeButtonを受け取る
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  text,
  link,
  isModalVisible,
  setIsModalVisible,
  handleNavigate,
  activeButton, // activeButtonを受け取る
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
      <p>現在のボタン: {activeButton}</p> {/* activeButtonを表示 */}
    </Modal>
  );
};

export default ModalComponent;
