import React, { useState, useEffect } from "react";
import { Col, Nav, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import lookUpService from "../../services/lookUpService";
import conferencesService from "services/conferenceService";
import { onGlobalError } from "services/serviceHelpers";

const ViewButtonSort = ({ keyGrid, keyList, onSort, onConferenceChange, userRole, conferenceId }) => {
  const [categories, setCategories] = useState({
    list: [],
    mappedCategories: null,
  });
  const cService = conferencesService;
  const [conferences, setConferences] = useState({ all: null, mappedConferences: null });

  useEffect(() => {
    cService.getAll().then(onGetConferencesSuccess).catch(onGlobalError);
  }, []);
  const onGetConferencesSuccess = (response) => {
    setConferences(() => {
      const items = response.items;
      const newConferences = {};
      newConferences.all = items;
      newConferences.mappedConferences = items.map((conference) => {
        return (
          <option key={conference.id} value={conference.id}>
            {conference.name}
          </option>
        );
      });
      return newConferences;
    });
  };
  useEffect(() => {
    lookUpService.lookUp(["ResourceCategories"]).then(onGetCategoriesSuccess).catch(onGlobalError);
  }, []);

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
  return (
    <>
      <Col lg={6} md={12} sm={12} xs={12} className="d-flex justify-content-around flex-wrap mx-auto">
        <Form className="d-flex col-lg-12 d-flex justify-content-between ">
          <Col className="d-inline-flex col-lg-6 ">
            <Form.Select as="select" name="sortBy" className="form-select mb-3 col-lg-6 me-2" onChange={onSort}>
              <option value="" key={0}>
                Show All Categories{" "}
              </option>
              {categories.mappedCategories}
            </Form.Select>
            {userRole[0] === "Admin" && (
              <Form.Select as="select" name="sortBy" className="form-select mb-3 col-lg-6" onChange={onConferenceChange} value={conferenceId}>
                <option value="" key={0}>
                  Show All Conferences{" "}
                </option>
                {conferences.mappedConferences}
              </Form.Select>
            )}
          </Col>
        </Form>
      </Col>
      <Col>
        <Nav className="justify-content-end d-flex flex-nowrap ">
          <Nav.Item className="btn-group">
            <Nav.Link eventKey={keyGrid} className="mb-sm-3 mb-md-0 p-0">
              <Button variant="outline-primary" className="btn-outline-white btn-tab-left">
                <i className="bi bi-grid">Grid</i>
              </Button>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="btn-group">
            <Nav.Link eventKey={keyList} className="mb-sm-3 mb-md-0 p-0">
              <Button variant="outline-primary" className="btn-outline-white btn-tab-right">
                <i className="bi bi-list-ul">List</i>
              </Button>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
    </>
  );
};

ViewButtonSort.propTypes = {
  keyGrid: PropTypes.string.isRequired,
  keyList: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  onConferenceChange: PropTypes.func.isRequired,
  userRole: PropTypes.arrayOf(PropTypes.string).isRequired,
  conferenceId: PropTypes.number,
};

export default ViewButtonSort;
