import { ErrorMessage, Field, Form, Formik } from "formik";
import resourceSchema from "schemas/resourceSchema";
import { Card, Row, Col } from "react-bootstrap";
import { CardBody, Button, Modal, ModalFooter } from "reactstrap";
import FileUpload from "components/files/FileUpload";
import TitleHeader from "components/general/TitleHeader";
import ResourceCategoryForm from "./ResourceCategoryForm";
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lookUpService from "services/lookUpService";
import "./resource.css";
import PropTypes from "prop-types";
import resourceService from "services/resourceService";
import ResourceCard from "./ResourceCard";
import toastr from "toastr";
import { useLocation } from "react-router-dom";
import FilesViewer from "../../components/files/FilesViewer.jsx";
function ResourceForm(props) {
  const location = useLocation();
  const user = props.currentUser;
  const [resourceId] = useState(location.state?.resourceId);
  const [fileData, setFileData] = useState({
    file: { id: null, url: null },
    imageFile: { id: null, url: null },
  });

  const [categories, setCategories] = useState({
    list: [],
    mappedCategories: null,
    selectedCategoryName: "",
  });

  const [formData, setFormData] = useState({
    conferenceId: user.conferenceId,
    name: "",
    description: "",
    resourceCategoryId: "",
    resourceCategoryName: "",
    userId: user.id,
    dateCreated: "",
    dateModified: "",
  });

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    getCategories();
  };

  useEffect(() => {
    lookUpService.lookUp(["ResourceCategories"]).then(onGetCategoriesSuccess);
  }, []);

  useEffect(() => {
    if (location.state?.resourceId) {
      resourceService.getById(location.state?.resourceId).then(onGetByIdSuccess).catch();
    }
  }, []);

  const getCategories = () => {
    lookUpService.lookUp(["ResourceCategories"]).then(onGetCategoriesSuccess);
  };

  const onGetByIdSuccess = (response) => {
    const resourceData = response.data.item;
    setFormData((prevData) => {
      const newData = { ...prevData };
      newData.name = resourceData.name;
      newData.description = resourceData.description;
      newData.resourceCategoryId = resourceData.resourceCategory.id;
      newData.resourceCategoryName = resourceData.name;
      newData.dateCreated = resourceData.dateCreated;
      newData.dateModified = resourceData.dateModified;
      return newData;
    });
    setFileData((prevData) => {
      const newFileData = { ...prevData };
      if (resourceData?.coverImage)
        newFileData.imageFile = {
          id: resourceData.coverImage?.id,
          url: resourceData.coverImage?.url,
        };
      if (resourceData?.file) {
        newFileData.file = { id: resourceData.file.id, url: resourceData.file.url };
      }
      return newFileData;
    });
  };
  const onGetCategoriesSuccess = (response) => {
    setCategories((prevState) => {
      let categories = { ...prevState };
      categories.list = response.item.resourceCategories;
      categories.mappedCategories = mapCategoryOptions(categories.list);

      return categories;
    });
  };
  const mapCategoryOptions = (resourceCategories) => {
    return resourceCategories.map((cat) => {
      return (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      );
    });
  };

  const onImageSubmitSuccess = (fileData) => {
    setFileData((prevFileData) => {
      let newFileData = { ...prevFileData };
      newFileData.imageFile = fileData;
      return newFileData;
    });
  };
  const onFileSubmitSuccess = (fileData) => {
    setFileData((prevFileData) => {
      let newFileData = { ...prevFileData };
      newFileData.file = fileData;
      return newFileData;
    });
  };

  const onResourceSubmit = (values) => {
    const payload = { ...values };
    if (fileData.file?.id) {
      payload.fileId = fileData.file?.id;
    }
    if (fileData.imageFile?.id) {
      payload.coverImageId = fileData.imageFile?.id;
    }
    if (resourceId) {
      payload.id = resourceId;
      resourceService.update(payload).then(onResourceAddSuccess);
    } else {
      resourceService.add(payload).then(onResourceAddSuccess);
    }
  };
  const onResourceAddSuccess = () => {
    toastr["success"]("Resource Successfully Added", "Success");
  };

  return (
    <>
      <TitleHeader title={!location.state ? "New Resource" : `Edit ${formData.name} Resource`} />
      <>
        <Modal isOpen={modal} toggle={toggle}>
          <ResourceCategoryForm />
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
      <div className="mx-3 resource card-preview">
        <Row>
          <Formik
            onSubmit={onResourceSubmit}
            initialValues={formData}
            validationSchema={resourceSchema}
            enableReinitialize={true}
            validateonChange={true}
          >
            {({ values }) => (
              <Form>
                <Row className="d-flex justify-content-between">
                  <Col xl={8} lg={8} md={12} sm={12} className="mb-4 ml-4 mx-auto">
                    <Card>
                      <CardBody className="resource-form-card card-body">
                        <div>
                          <label className="form-label" htmlFor="resourceCategoryId">
                            Resource Category
                          </label>
                          <Field component="select" name="resourceCategoryId" className="form-control">
                            <option value={0} default>
                              Select an Option{" "}
                            </option>
                            {categories.mappedCategories}
                          </Field>
                          <ErrorMessage name="resourceCategoryId" component="div" className="text-danger" />
                          <div className="d-flex justify-content-end ">
                            <Link active="true" color="dark" size="sm" onClick={toggle}>
                              Add Category
                            </Link>
                          </div>
                        </div>
                        <div className="mb-2 mt-2">
                          <label className="form-label" htmlFor="name">
                            Name
                          </label>
                          <Field name="name" placeholder="Name" type="text" id="name" className="form-control" />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="mb-2 mt-2 resources">
                          <label className="form-label " htmlFor="description">
                            Description
                          </label>
                          <Field
                            name="description"
                            placeholder="Brief Description of the Resource"
                            component="textarea"
                            rows="3"
                            id="code"
                            className="form-control"
                          />
                          <ErrorMessage name="description" component="div" className="text-danger" />
                          <Row className="mb-2 mt-2 d-flex resources">
                            <Col className="resources">
                              <label htmlFor="imageData" className="form-label">
                                New Cover Image Upload
                              </label>
                              <FileUpload
                                name="imageData"
                                className="max-width-100"
                                isMultiple={false}
                                handleUploadSuccess={(response) => {
                                  onImageSubmitSuccess(response.item[0]);
                                }}
                              />
                            </Col>
                            <Col className="resources">
                              <label className="form-label" htmlFor="fileData">
                                New File Upload
                              </label>
                              <FileUpload
                                name="fileData"
                                className="max-width-100"
                                isMultiple={false}
                                handleUploadSuccess={(response) => {
                                  onFileSubmitSuccess(response.item[0]);
                                }}
                              />
                            </Col>
                          </Row>
                        </div>
                        <Col>
                          {fileData.file.url && <FilesViewer className="resources" file={fileData.file.url} />}
                          <Row>
                            <div className="mt-4 col-12">
                              {!location.state ? (
                                <button type="submit" className="btn btn-info">
                                  Submit
                                </button>
                              ) : (
                                <button type="submit" className="btn btn-warning">
                                  Update
                                </button>
                              )}
                              <a href="/resources/" className="btn btn-outline-primary ms-2">
                                Close
                              </a>
                            </div>
                          </Row>
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <ResourceCard
                      formData={values}
                      imageData={fileData.imageFile}
                      currentUser={props.currentUser}
                      categories={categories.list}
                      fileData={fileData.file}
                    ></ResourceCard>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Row>
      </div>
    </>
  );
}
ResourceForm.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceForm;
