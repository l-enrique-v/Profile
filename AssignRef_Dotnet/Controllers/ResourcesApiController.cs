using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Resources;
using Sabio.Models.Requests.Resources;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/resources")]
    [ApiController]
    public class ResourcesApiController: BaseApiController
    {
        private IResourceService _service = null;

        private IAuthenticationService<int> _authService = null;
        public ResourcesApiController( IResourceService service, ILogger<PingApiController> logger,
          IAuthenticationService<int> authService ) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add( ResourceAddRequest model )
        {
            int iCode = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                response = new ItemResponse<int> { Item = id };

            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
        [HttpPost("type")]
        public ActionResult<ItemsResponse<int>> AddCategory( ResourceCategoryAddRequest model )
        {
            int iCode = 201;
            BaseResponse response = null;

            try
            {

                int id = _service.AddCategory(model);
                if ( id > 0 )
                {
                    response = new ItemResponse<int> { Item = id };
                }

            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemsResponse<Resource>> GeteById( int id )
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {

                Resource receivedResource = _service.GetById(id);
                if( receivedResource == null ) {
                    response = new ErrorResponse("Resource not Found");
                }
                else { response = new ItemResponse<Resource> { Item = receivedResource }; }
               

            }
            catch ( Exception ex )
            {
                iCode = 404;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("type/delete/{id:int}")]
        public ActionResult<ItemsResponse<Resource>> DeleteCategory( int id )
        {
                int iCode = 200;
                BaseResponse response = null;
                try
                {
                    int userId = _authService.GetCurrentUserId();
                    _service.DeleteCategory(id);
                    response = new SuccessResponse();

                }
                catch ( Exception ex )
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                }
                return StatusCode(iCode, response);
            
        }
        [HttpGet]
        public ActionResult<ItemResponse<Paged<Resource>>> GetAll( int pageIndex, int pageSize )
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Resource> page = _service.GetAll( pageIndex, pageSize);

                if ( page == null )
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch ( Exception ex )
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("paginate/filter")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetFilterPaginatel(ResourceFilterRequest model)
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                Paged<Resource> page = _service.GetFilterPaginated(model);

                if ( page == null )
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch ( Exception ex )
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetByConferenceId( int id, int pageIndex, int pageSize )
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                Paged<Resource> page = _service.GetByConferenceId(id, pageIndex, pageSize);

                if ( page == null )
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch ( Exception ex )
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Resource>>> Search( string query, int pageIndex, int pageSize, int id )
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<Resource> resourceList = _service.Search(query, pageIndex, pageSize, id);
                if ( resourceList.TotalCount == 0 )
                {
                    iCode = 404;
                    response = new ErrorResponse($"No Resources found on {pageIndex}");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<Paged<Resource>> { Item = resourceList };
                }
            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("search/type")]
        public ActionResult<ItemsResponse<Paged<Resource>>> GetByCategoryId( int resourceType, int pageIndex, int pageSize )
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {

                Paged<Resource> resourceList = _service.GetByCategoryId(resourceType, pageIndex,pageSize);
                if ( resourceList.TotalCount == 0 )
                {
                    iCode = 404;
                    response = new ErrorResponse($"No Resources found on {pageIndex}");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<Paged<Resource>> { Item = resourceList };
                }
            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpPut("delete/{id:int}")]
        public ActionResult<SuccessResponse> Delete( int id )
        {
            int iCode = 200;
            BaseResponse response = null;


            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Delete(id, userId);
                response = new SuccessResponse();

            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemsResponse<int>> Update( ResourceUpdateRequest model )
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();

            }
            catch ( Exception ex )
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
    }
}
