
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FinalGroupProject.Models
{
    public class Form
    {
        [Key]
        public int Id { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public int radius { get; set; }
        public string type { get; set; }
    }
}
            