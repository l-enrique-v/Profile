using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Files
{
    public class FileAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string Url { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int FileTypeId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int CreatedBy { get; set; }
      
    }
}
