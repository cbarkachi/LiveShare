import React from "react";
import { Modal } from "antd";
import TableDetails from "./TableDetails";
import "./CloseModal.css";

export default function ReservationModal({
  modalVisible,
  setModalVisible,
  times,
  tabNames,
  price
}) {
  return (
    <Modal
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      // maskStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      // wrapClassName="review_modal"
      width="70%"
      // height="900px !important"
      style={{ height: "80vh" }}
      bodyStyle={{ height: "80vh", padding: "0", borderRadius: "30%" }}
    >
      <TableDetails times={times} tabNames={tabNames} reserve={true} price={price} />
    </Modal>
  );
}
