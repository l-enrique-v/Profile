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

const ResourceCardList = (props) => {
  let item = props.item;
  const [fileName, setFileName] = useState();
  const navigate = useNavigate();
  let dateCreated = formatDate(item.dateCreated);
  let dateModified = formatDate(item.dateModified);
  let description = item.description;

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

  return (
    <Card className="mb-3 card-hover resource-card-shadow resource-card-list p-0  ">
      <Card.Body className="p-0">
        <Col className="float-end align-items-start">
          <Dropdown className="float-end mt-0resourece">
            <Dropdown.Toggle className=" dropdown-BG resource">
              <MoreVertical size="15px" className="text-secondary" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Header>OPTIONS</Dropdown.Header>
              <Dropdown.Item
                eventKey="1"
                onClick={() => {
                  navigate(`/resources/edit/${item.id}/`, {
                    state: { resourceId: item.id },
                  });
                }}
              >
                <Edit size="18px" className="dropdown-item-icon" /> Edit
              </Dropdown.Item>
              <Dropdown.Item eventKey="2"></Dropdown.Item>
              <Dropdown.Item eventKey="3" onClick={onDeleteClick}>
                <Trash size="18px" className="dropdown-item-icon" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Row className="align-items-between  d-flex ">
          <Col className="d-none d-md-block  col-md-5 col-lg-4 col-xl-2 p-0 ">
            <Link to={item.file && item.file.url}>
              <img src={item.coverImage?.url || DefaultImage} alt="..." className="resource-coverImage-list img-fluid " />
            </Link>
          </Col>
          <Row className="col-md-6 col-lg-8 d-flex align-items-start justify-items-start flex-column mt-3">
            <h3 className="mb-2 text-truncate-line-2 ">{item.name}</h3>
            <Col className="justify-items-between d-flex col-12">
              <h4>
                <span className="badge text-bg-secondary">{item.resourceCategory.name}</span>
              </h4>
            </Col>
            <Row>
              <span className="fs-5 mb-4"> Description: {description}</span>
              <span className="fs-6 "> {`Date Created: ${dateCreated}`}</span>
              <span className="fs-6 mb-4"> {`Date Modified: ${dateModified}`}</span>
            </Row>
            {item.file?.url && (
              <a className="row d-inline-flex mb-3 col-6 justify-content-start flex-nowrap" href={item.file.url} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faDownload} className="col-1 ps-1" />
                <h6 color="cyan" className=" col-11 text-info resources ps-1 ms-0">
                  {" Download File - "}
                  {fileName}
                </h6>
              </a>
            )}
          </Row>
        </Row>
      </Card.Body>
    </Card>
  );
};

ResourceCardList.propTypes = {
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

export default ResourceCardList;
