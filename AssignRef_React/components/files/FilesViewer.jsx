import React, { useState, useEffect } from "react";
import FileViewer from "react-file-viewer";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import "./file.css";
import { Button, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import { OBJModel, DAEModel, DirectionLight } from "react-3d-viewer";
function FilesViewer(props) {
  const [file, setFile] = useState({ url: null, fileType: null });
  const [fileModal, setFileModal] = useState(false);
  const [viewer, setViewer] = useState(null);

  const toggleModal = () => {
    setFileModal(!fileModal);
  };

  useEffect(() => {
    setFile({ url: props.file, fileType: getFileType(props.file) });
  }, [props.file]);

  useEffect(() => {
    updateViewer();
  }, [file.url]);

  const getFileType = (file) => {
    const newType = file.split(".").pop().toLowerCase();
    return newType;
  };

  const updateViewer = () => {
    const frame = (
      <FileViewer
        className="frame-wrapper max-h-fit resources-iframe"
        key={file.url}
        fileType={file.fileType}
        filePath={file.url}
        onError={onError}
      />
    );
    const frameType = {
      pdf: (
        <iframe className="mx-auto resources-iframe" src={file.url}></iframe>
      ),
      obj: <OBJModel src={file.url} texPath="" />,
      dae: (
        <DAEModel
          src={file.url}
          onLoad={() => {
            // ...
          }}
        >
          <DirectionLight color={0xff00ff} />
        </DAEModel>
      ),
      png: (
        <img
          className="mx-auto viewer-img resources-iframe"
          src={file.url}
        ></img>
      ),
      jpg: (
        <img
          className="mx-auto viewer-img resources-iframe"
          src={file.url}
        ></img>
      ),
      jpeg: frame,
      bmp: frame,
      csv: frame,
      xslx: frame,
      docx: frame,
      mp4: frame,
      webm: frame,
      mp3: frame,
    };

    if (frameType[file.fileType]) {
      setViewer(frameType[file.fileType]);
    } else setViewer(frame);
  };

  const onError = () => {
    return;
  };

  return (
    <div className="files-viewer">
      <Modal
        className="modal-file-viewer"
        isOpen={fileModal}
        toggleModal={toggleModal}
      >
        <div className="card m-3 files-modal">{viewer}</div>
        <div className="p-3">
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </div>
      </Modal>
      <Col>
        <Row>
          <Link onClick={toggleModal}>
            <h5 className="link-info float-start mt-3 mb-1">
              Click to preview current file.
            </h5>
          </Link>
        </Row>
        {viewer && <Row>{viewer}</Row>}
      </Col>
    </div>
  );
}

FilesViewer.propTypes = {
  file: PropTypes.string.isRequired,
};

export default FilesViewer;
