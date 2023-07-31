using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourceUpdateRequest: ResourceAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
