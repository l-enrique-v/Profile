import React, { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { upload } from "services/fileService";
import "./fileuploader.css";
import toastr from "toastr";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("gameform");
function FileUpload({ isMultiple, handleUploadSuccess }) {
  const defaultDropzoneText = "None  Selected";
  const [fileName, setFileName] = useState(defaultDropzoneText);

  const onDrop = useCallback((acceptedFiles) => {
    let formData = new FormData();
    for (let i = 0; i < acceptedFiles?.length; i++) {
      formData.append("file", acceptedFiles[i]);
    }
    const name = formData.get("file").name;
    upload(formData)
      .then((res) => onUploadFilesSuccess(res, name))
      .catch(onUploadFilesFail);
    _logger("This is going to parent", formData);
  }, []);

  const onUploadFilesSuccess = (res, name) => {
    setFileName(name);
    handleUploadSuccess(res);
    toastr["success"]("You Uploaded a File", "Success");
  };

  const onUploadFilesFail = () => {
    toastr["error"]("There was a problem getting the result", "error");
  };

  return (
    <React.Fragment>
      <Dropzone onDrop={onDrop} multiple={isMultiple}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              backgroundColor:
                fileName === defaultDropzoneText
                  ? "rgb(230, 230, 230)"
                  : "rgb(202, 239, 202)",
            }}
            className="form-control file-uploader-dropzone-area"
            {...getRootProps()}
          >
            {fileName}
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
    </React.Fragment>
  );
}
FileUpload.propTypes = {
  isMultiple: PropTypes.bool,
  handleUploadSuccess: PropTypes.func,
  acceptedFiles: PropTypes.func,
  event: PropTypes.func,
};

export default FileUpload;
