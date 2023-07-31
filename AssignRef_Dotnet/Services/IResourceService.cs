using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Resources;
using Sabio.Models.Requests.Resources;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Xml.Linq;

namespace Sabio.Services.Interfaces
{
    public interface IResourceService
    {
        int Add( ResourceAddRequest request, int userId );
        int AddCategory( ResourceCategoryAddRequest request );
        Resource GetById( int id );
        Paged<Resource> GetByConferenceId(int id, int pageIndex, int pageSize);
        Paged<Resource> GetByCategoryId( int resourceCategoryId, int pageIndex, int pageSize );
        Paged<Resource> Search( string query, int pageIndex, int pageSize, int id );
        Paged<Resource> GetAll( int pageIndex, int pageSize );
        Paged<Resource> GetFilterPaginated(ResourceFilterRequest model );
        LookUp GetCategoryById( int id );
        void DeleteCategory(int id );
        void Delete( int id, int userId );
        void Update( ResourceUpdateRequest request, int userId );


    }
}