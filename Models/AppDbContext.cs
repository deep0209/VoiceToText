using Microsoft.EntityFrameworkCore;
using FinalGroupProject.Models;

namespace FinalGroupProject.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
                : base(options)
        {
        }
        public DbSet<FavLocation> FavLocation { get; set; }
        public DbSet<SearchedSpeechHistory> SearchedSpeechHistory { get; set; }

        public DbSet<Form> Searchedquery {get; set;}

    }
}