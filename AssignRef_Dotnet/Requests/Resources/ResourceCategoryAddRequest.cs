using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourceCategoryAddRequest
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; }
    }
}
