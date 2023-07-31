using Sabio.Models.Domain.Conferences;
using Sabio.Models.Domain.Files;
using System;

namespace Sabio.Models.Domain.Resources
{
    public class Resource
    {
        public int Id { get; set; }
        public BaseConference Conference{ get; set; }
        public LookUp ResourceCategory { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public File CoverImage { get; set; }
        public File  File { get; set; }
        public bool IsActive { get; set; }
        public BaseUser Author { get; set; }
        public BaseUser ModifyingAuthor { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
