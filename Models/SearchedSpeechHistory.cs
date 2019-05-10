
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FinalGroupProject.Models
{
    public class SearchedSpeechHistory
    {
        [Key]
        public int Id { get; set; }

        public string Filename { get; set; }

        public string ConvertedText { get; set; }

        public DateTime? RecordedDate { get; set; }
    }
}
            