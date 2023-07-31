import React, { useState, Fragment, useCallback } from "react";
import { Col, Row, Tab } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-feather";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import { useEffect } from "react";
import resourceService from "services/resourceService";
import "./resource.css";
import TitleHeader from "components/general/TitleHeader";
import ViewButtonSort from "./ViewButtonSort";
import PropTypes from "prop-types";
import ResourceCardList from "./ResourceCardList";
import ResourceCardGrid from "./ResourceCardGrid";
import Swal from "sweetalert2";


function Resources(props) {
  const user = props.currentUser;
  const rService = resourceService;

  const [pageData, setPageData] = useState({
    currentPage: 1,
    pageSize: 8,
    totalCount: 0,
    arrayOfResources: [],
    displayRecordsList: [],
    displayRecordsGrid: [],
    searchBar: null,
    pageIndex: "",
    filters: {
      conferenceId: user.conferenceId,
      categoryId: null,
    },
    pageError: { isError: false },
  });

  const [payload, setPayload] = useState({
    conferenceId: pageData.filters.conferenceId,
    resourceCategoryId: pageData.filters.categoryId,
    query: pageData.searchBar,
    pageIndex: pageData.currentPage - 1,
    pageSize: 8,
  });

  useEffect(() => {
    setPayload(() => {
      const newPayload = {
        conferenceId: pageData.filters.conferenceId,
        resourceCategoryId: pageData.filters.categoryId,
        query: pageData.searchBar,
        pageIndex: pageData.currentPage - 1,
        pageSize: 8,
      };
      return newPayload;
    });
  }, [pageData.filters.conferenceId, pageData.filters.categoryId, pageData.searchBar, pageData.currentPage, pageData.pageSize, pageData.totalCount]);

  useEffect(() => {
    getAllResources(payload);
  }, [payload.conferenceId, payload.resourceCategoryId, payload.query, payload.pageIndex, payload.pageSize, pageData.totalCount]);

  const onConferenceChange = useCallback((e) => {
    let value = e.target.value;
    setPageData((prevState) => {
      const newData = { ...prevState };
      newData.currentPage = 1;
      if (value) {
        newData.filters.conferenceId = value;
      } else {
        newData.filters.conferenceId = null;
      }
      return newData;
    });
  });

  const getAllResources = () => {
    rService.get(payload).then(onGetAllSuccess).catch(onNoResourcesFound);
  };

  const onSort = (e) => {
    let value = e.target.value;
    setPageData((prevState) => {
      const categoryState = { ...prevState };
      categoryState.currentPage = 1;
      if (value) {
        categoryState.filters.categoryId = value;
      } else {
        categoryState.filters.categoryId = null;
      }
      return categoryState;
    });
  };

  const onSetPageData = (totalCount, arrayOfResources, pageError) => {
    setPageData((prevState) => {
      const newData = { ...prevState };
      if (pageError.isError) {
        newData.pageError = pageError;
      } else newData.pageError.isError = false;
      if (arrayOfResources) {
        newData.arrayOfResources = arrayOfResources;
        newData.totalCount = totalCount;
        newData.displayRecordsList = newData.arrayOfResources.map((aResource) => {
          return <ResourceCardList cardId={aResource.id} item={aResource} key={`List` + aResource.id} DeleteClick={onDelete} />;
        });
        newData.displayRecordsGrid = newData.arrayOfResources.map((aResource) => {
          return <ResourceCardGrid cardId={aResource.id} item={aResource} key={`Grid` + aResource.id} DeleteClick={onDelete} />;
        });
      }
      return newData;
    });
  };
  const onDelete = (id) => {
    rService.deleteById(id).then(onRemoveSuccess(id)).catch(onRemoveError);
  };

  const onSearchFieldChange = (event) => {
    let value = event.target.value;
    setPageData((prevState) => {
      const newPageData = { ...prevState };
      newPageData.searchBar = value;
      return newPageData;
    });
  };
  const pageChangeClicked = (page) => {
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.currentPage = page;
      return pd;
    });
  };

  const resourceListView = () => {
    return (
      <React.Fragment viewby="list">
        <Row className="card-deck d-flex mx-auto justify-content-between">
          {pageData.displayRecordsList.length > 0 ? pageData.displayRecordsList : <Col>No matching records found.</Col>}
        </Row>
      </React.Fragment>
    );
  };

  const resourceGridView = () => {
    return (
      <React.Fragment viewby="grid">
        <Row className="card-group d-flex">
          {pageData.displayRecordsGrid.length > 0 ? pageData.displayRecordsGrid : <Col>No matching records found.</Col>}
        </Row>
      </React.Fragment>
    );
  };

  const onGetAllSuccess = (response) => {
    let paginatedList = response.data.item.pagedItems;
    const pageError = paginatedList ? { isError: false } : { isError: true, errorText: "No Resources Found" };
    let totalCount = response.data.item.totalCount;
    onSetPageData(totalCount, paginatedList, pageError);
  };

  const onNoResourcesFound = () => {
    setPageData((prevData) => {
      const newPageData = { ...prevData };
      newPageData.pageError = {
        isError: true,
        errorText: "No Resources Found",
      };
      return newPageData;
    });
  };

  const onRemoveSuccess = (id) => {
    Swal.fire("Deleted!", "Resource has been deleted.");
    setPageData((prev) => {
      const newData = { ...prev };
      newData.totalCount = newData.totalCount - 1;
      newData.pageSize = 7;
      newData.arrayOfResources = newData.arrayOfResources.filter((resource) => resource !== id);
      return newData;
    });
  };

  const onRemoveError = (error) => {
    Swal.fire("Error!", "Error Deleting Files.", error);
  };

  return (
    <Fragment>
      <TitleHeader title="Resources" buttonText="New Resource" buttonLink="/resources/new" />
      <div className="resource-container">
        <Tab.Container defaultActiveKey="grid" className="mx-auto">
          <Row className="d-flex justify-content-between mx-auto ">
            <Row lg={12} md={12} sm={12} className="mb-4">
              <Col xl={4} lg={4} md={12} sm={12} className="pe-0">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Resources"
                  value={pageData.searchBar}
                  onChange={onSearchFieldChange}
                />
              </Col>
              <ViewButtonSort
                userRole={user.roles}
                className="col"
                keyGrid="grid"
                keyList="list"
                onSort={onSort}
                onConferenceChange={onConferenceChange}
                conferenceId={pageData.filters.conferenceId}
              />
            </Row>
            {pageData.pageError.isError && (
              <Col>
                <h3>{pageData.pageError.errorText}</h3>
              </Col>
            )}
            {!pageData.pageError.isError && (
              <Col>
                <h4 className="pb-3 pb-lg-0">
                  Displaying {pageData.displayRecordsGrid.length} out of {pageData.totalCount} Resources
                </h4>
                <Tab.Content>
                  <Tab.Pane eventKey="grid" className="pb-4">
                    {resourceGridView()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="list" className="pb-4">
                    {resourceListView()}
                  </Tab.Pane>
                </Tab.Content>
                {pageData.totalCount > pageData.pageSize && (
                  <Pagination
                    onClick={window.scrollTo(0, 0)}
                    className="text-center"
                    prevIcon={<ChevronLeft size="14px" />}
                    nextIcon={<ChevronRight size="14px" />}
                    onChange={pageChangeClicked}
                    current={pageData.currentPage}
                    total={pageData.totalCount}
                    locale={locale}
                    defaultPageSize={pageData.pageSize}
                  />
                )}
              </Col>
            )}
          </Row>
        </Tab.Container>
      </div>
    </Fragment>
  );
}
Resources.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Resources;
