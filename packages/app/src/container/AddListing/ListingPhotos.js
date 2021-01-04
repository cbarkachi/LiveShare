import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Button } from "components/UI/Button/Button";

const { Dragger } = Upload;

const ListingPhotos = ({ setStep, setImages }) => {
  const [fileList, setFileList] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fileList.length === 0) {
      alert("You must upload at least one photo!");
      return;
    }
    if (fileList.length > 3) {
      alert("You can't upload more than three photos!");
      return;
    }
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
    const files = fileList.map((file) => file.originFileObj);
    setImages(files);
    setStep();
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
      setFileList(info.fileList);
    },
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Listing Photos</h2>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">Upload up to three photos.</p>
        </Dragger>
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
};

export default ListingPhotos;
