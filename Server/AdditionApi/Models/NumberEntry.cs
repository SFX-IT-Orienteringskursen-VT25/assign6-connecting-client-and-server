using System;
using System.ComponentModel.DataAnnotations;

namespace AdditionApi.Models
{
    public class NumberEntry
    {
        [Key]
        public int Id { get; set; }

        public double Value { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
