import React, { useState, useEffect } from "react";
import { Col, Card, Row } from "react-bootstrap";
import "rc-pagination/assets/index.css";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { Trash, Edit, MoreVertical } from "react-feather";
import DefaultImage from "../../assets/images/brand/logo/square_v8.png";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { formatDate } from "utils/dateFormater";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ResourceCardGrid = (props) => {
  const [fileName, setFileName] = useState();

  const item = props.item;
  const navigate = useNavigate();

  let dateCreated = formatDate(item.dateCreated);
  let dateModified = formatDate(item.dateModified);

  useEffect(() => {
    setFileName(() => {
      let newName = null;
      if (item.file?.url) {
        const fileUrl = item.file?.url;
        newName = fileUrl.split("_-_").pop();
      }
      return newName;
    });
  }, []);

  const onDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        props.DeleteClick(item.id);
      }
    });
  };

  const onEditClicked = () => {
    navigate(`/resources/edit/${item.id}/`, {
      state: { resourceId: item.id },
    });
  };
  return (
    <Col xl={3} lg={4} md={6} sm={12} className={`mb-4 resource-card-container`}>
      <Card className=" card-hover resource-card-shadow h-100 w-100">
        <Link className="d-flex" to={item.file && item.file.url}>
          <img src={item.coverImage?.url || DefaultImage} className=" img-fluid resource-coverImage resource-card-height" />
        </Link>
        <Card.Body className="p-2">
          <div>
            <div>
              <h3 className="h4 mb-2 text-truncate-line-2">
                <span>{item.name}</span>
              </h3>
              <div>
                <h4>
                  <span className="badge text-bg-secondary ">{item.resourceCategory.name}</span>
                </h4>
                {item.file?.url && (
                  <Row className="col-12 mt-3 d-flex flex-nowrap">
                    <FontAwesomeIcon icon={faDownload} className="col-1" />
                    <a className="col-8 ps-0 pe-0 me-0" href={item.file.url} target="_blank" rel="noreferrer">
                      <h6 color="cyan" className=" text-info resources pe-2 ps-0 me-2">
                        {" Download File - "}
                        {fileName}
                      </h6>
                    </a>
                  </Row>
                )}
              </div>
              <span className="fs-5 resource-text-wrap"> Description: {item.description}</span>
            </div>
          </div>
          <div className="row float-end mb-0 resource-dropdown">
            <Dropdown className=" float-end resource mt-1 mb-0 mx-0">
              <Dropdown.Toggle className=" dropdown-BG resource d-flex justify-content-between">
                <MoreVertical size="15px" className="text-secondary  float-start" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="center">
                <Dropdown.Header>OPTIONS</Dropdown.Header>
                <Dropdown.Item eventKey="5" onClick={onEditClicked}>
                  <Edit size="18px" className="dropdown-item-icon" /> Edit
                </Dropdown.Item>
                <Dropdown.Item eventKey="3" onClick={onDeleteClick}>
                  <Trash size="18px" className="dropdown-item-icon" /> Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
        <div className="card-footer">
          <span className="fs-6 text-muted "> {`Date Created: ${dateCreated}`}</span>
          <br></br>
          <span className="fs-6 text-muted  mb-1"> {`Date Modified: ${dateModified}`}</span>
        </div>
      </Card>
    </Col>
  );
};

ResourceCardGrid.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    conference: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      code: PropTypes.string,
      logo: PropTypes.string,
    }),
    resourceCategory: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    name: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.shape({
      name: PropTypes.string,
      isDeleted: PropTypes.bool,
      createdBy: PropTypes.number,
      dateCreated: PropTypes.string,
      fileType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    file: PropTypes.shape({
      name: PropTypes.string,
      isDeleted: PropTypes.bool,
      createdBy: PropTypes.number,
      dateCreated: PropTypes.string,
      fileType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    isActive: PropTypes.bool,
    author: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    modifyingAuthor: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
  }),
  DeleteClick: PropTypes.func.isRequired,
};

export default ResourceCardGrid;
