import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { addCategory, deleteCategory } from "services/resourceService";
import { Row, Col } from "react-bootstrap";
import lookUpService from "services/lookUpService";
import toastr from "toastr";
import resourceCategorySchema from "schemas/resourceCategoryShema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import debug from "sabio-debug";
const _logger = debug.extend("ResourceCategoryForm");

function ResourceCategoryForm() {
  const [formData] = useState({
    name: "",
  });

  const [categories, setCategories] = useState({});

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    lookUpService.lookUp(["ResourceCategories"]).then(onLookUpSuccess).catch(onLookUpError);
  };
  const onLookUpSuccess = (response) => {
    const categories = response.item.resourceCategories;
    setCategories((prevState) => {
      const newState = { ...prevState };
      newState.list = categories;
      newState.mappedCategories = categories?.map(mapCategories);
      return newState;
    });
  };

  const onDelete = (id) => {
    _logger(id, "TESTING");
    deleteCategory(id).then(onDeleteSuccess).catch(onDeleteError);
  };

  const onDeleteSuccess = (response) => {
    _logger(response);
    toastr["success"]("Category Deleted", "Success!");
    getCategories();
  };

  const onDeleteError = (response) => {
    _logger(response);
    toastr["error"]("Could not delete Category", "Error!");
  };
  const onFormSubmit = (values) => {
    const exists = categories.list.some((category) => category.name === values);
    if (exists) {
      toastr["error"]("Category Already Exists", "Error!");
      return;
    }
    addCategory(values).then(onAddSuccess).catch(onAddError);
  };

  const onAddSuccess = () => {
    toastr["success"]("Category Added", "Success!");
    getCategories();
  };

  const onAddError = () => {
    toastr["error"]("Unable to Add Category", "Error");
  };

  const mapCategories = (value) => {
    return (
      <Row className="d-flex justify-content-between">
        <Col className="col-1">
          <FontAwesomeIcon onClick={() => onDelete(value.id)} className="resource delete-btn" icon={faX} />
        </Col>
        <Col>
          <tr className="d-flex resource no-cursor">
            <td className="text-dark fw-medium w-100">{value.name}</td>
          </tr>
        </Col>
      </Row>
    );
  };

  const onLookUpError = () => {
    toastr["Get Categories Error"]("Could not get Categories", "Error");
  };

  return (
    <div className="m-5">
      <Formik enableReinitialize={true} initialValues={formData} onSubmit={onFormSubmit} validationSchema={resourceCategorySchema}>
        <Form>
          <div className="form-label fw-bold">Current Categories</div>
          <table className="w-100  text-nowrap table">
            <tbody>{categories.mappedCategories}</tbody>
          </table>
          <div className="col">
            <div className="form-group my-3">
              <label htmlFor="categoryName" className="form-label fw-bold">
                Category Name
              </label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
          </div>
          <div className="d-flex flex-row-reverse align-items-end mb-3">
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default ResourceCategoryForm;
