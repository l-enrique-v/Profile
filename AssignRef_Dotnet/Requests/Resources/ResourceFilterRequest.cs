using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourceFilterRequest
    {
#nullable enable
        public int? ConferenceId { get; set; }
        public int? ResourceCategoryId { get; set; }
        public string? Query { get; set; }
#nullable disable

        public int PageIndex { get; set; }
        public int PageSize { get; set; }

    }
}
