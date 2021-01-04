import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Alert } from "react-bootstrap";
const { Dragger } = Upload;

export default function UploadProfile({ setPhoto, photo }) {
  const [numPhotosError, setNumPhotosError] = useState(false);
  const handleSubmit = (fileList) => {
    if (fileList.length !== 1) {
      setNumPhotosError(true);
      return;
    }
    setNumPhotosError(false);
    if (
      fileList.some((file) => {
        const components = file.name.split(".");
        return (
          !components ||
          components.length < 2 ||
          !["jpg", "png", "jpeg"].includes(components[components.length - 1])
        );
      })
    ) {
      alert("Invalid file uploaded. Please upload a jpg, jpeg, or png file");
      return;
    }
    setPhoto(fileList[0].originFileObj);
  };

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      handleSubmit(info.fileList);
    },
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {numPhotosError ? (
          <Alert variant="danger">You must only upload one photo!</Alert>
        ) : (
          <></>
        )}
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </Form>
    </>
  );
}
