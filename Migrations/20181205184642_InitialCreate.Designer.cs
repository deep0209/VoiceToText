﻿// <auto-generated />
using System;
using FinalGroupProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FinalGroupProject.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20181205184642_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("FinalGroupProject.Models.FavLocation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Latitude");

                    b.Property<string>("Longitude");

                    b.Property<string>("PlaceName");

                    b.HasKey("Id");

                    b.ToTable("FavLocation");
                });

            modelBuilder.Entity("FinalGroupProject.Models.Form", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("latitude");

                    b.Property<string>("longitude");

                    b.Property<int>("radius");

                    b.Property<string>("type");

                    b.HasKey("Id");

                    b.ToTable("Searchedquery");
                });

            modelBuilder.Entity("FinalGroupProject.Models.SearchedSpeechHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConvertedText");

                    b.Property<string>("Filename");

                    b.Property<DateTime?>("RecordedDate");

                    b.HasKey("Id");

                    b.ToTable("SearchedSpeechHistory");
                });
#pragma warning restore 612, 618
        }
    }
}
