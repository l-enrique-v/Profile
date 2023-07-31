
using System.ComponentModel.DataAnnotations;


namespace Sabio.Models.Requests.Resources
{
    public class ResourceAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int ConferenceId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int ResourceCategoryId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(1000)]
        public string Description { get; set; }

    
        [Range(1, int.MaxValue)]
        public int? CoverImageId { get; set; }

        [Range(1, int.MaxValue)]
        public int? FileId { get; set; }





    }
}
