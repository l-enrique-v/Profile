import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "react-bootstrap";
import DefaultImage from "../../assets/images/brand/logo/square_v8.png";
import { formatDate } from "utils/dateFormater";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function ResourceCard(props) {
  const imageData = props.imageData;
  const fileData = props.fileData;
  const [fileName, setFileName] = useState();

  useEffect(() => {
    setFileName(() => {
      let newName = null;
      if (fileData?.url) {
        const fileUrl = fileData.url;
        newName = fileUrl.split("_-_").pop();
      }
      return newName;
    });
  }, [fileData]);
  const [formData, setFormData] = useState({
    resourceData: props.formData,
    categoryData: props.categories,
  });
  const [foundCategory, setFoundCategory] = useState(<span className="badge text-bg-secondary ">{""}</span>);

  useEffect(() => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData.resourceData = props.formData;
      newData.categoryData = props.categories;
      return newData;
    });
  }, [props]);

  useEffect(() => {
    updateData();
  }, [formData.resourceData.resourceCategoryId]);

  const updateData = () => {
    const data = formData.resourceData.resourceCategoryId;
    if (formData.categoryData) {
      setFoundCategory((prevData) => {
        let newData = { ...prevData };
        const categoryArray = Object.values(formData.categoryData);
        let foundCategory = categoryArray.map((category) => {
          if (category.id.toString() === data) {
            return (
              <span key={category.id} className="badge text-bg-secondary ">
                {category.name}
              </span>
            );
          }
        });

        newData = foundCategory;
        return newData;
      });
    }
  };
  let dateCreated = formatDate(new Date());
  let dateModified = formatDate(new Date());

  return (
    <Card className=" card-hover resource-card-shadow  ">
      <img src={imageData?.url || DefaultImage} className=" img-fluid resource-coverImage " />
      <Card.Body>
        <div>
          <div>
            <h3 className="h4 mb-2 text-truncate-line-2">
              <span>{formData.resourceData.name}</span>
            </h3>
            <span className="fs-5 "> Description: {formData.resourceData.description}</span>
            <div>
              <span className="fs-6 text-muted  mb-1"> Date Created: {dateCreated}</span>
              <br></br>
              <span className="fs-6 text-muted "> Date Modified: {dateModified}</span>
            </div>
          </div>
        </div>
        <Row className="">
          <h4 className="Row">{foundCategory}</h4>
          {fileData.url && (
            <Row className="d-flex justify-content-start">
              <Col className="col-1 ">
                <FontAwesomeIcon icon={faDownload} />
              </Col>
              <Col className="col-11 mt-1">
                <a href={fileData.url} target="_blank" rel="noreferrer">
                  <h6 color="cyan" className=" text-info resources pe-2 ps-0">
                    {" Download File - "}
                    {fileName}
                  </h6>
                </a>
              </Col>
            </Row>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
ResourceCard.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    dateModified: PropTypes.string,
    resourceCategoryName: PropTypes.string,
    resourceCategoryId: PropTypes.string,
  }),
  imageData: PropTypes.shape({
    url: PropTypes.string,
  }),
  fileData: PropTypes.shape({
    url: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number, name: PropTypes.string })),
};
export default ResourceCard;
