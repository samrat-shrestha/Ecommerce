using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(z => z.Id).IsRequired();
            builder.Property(z => z.Name).IsRequired().HasMaxLength(100);
            builder.Property(z => z.Description).IsRequired();
            builder.Property(z => z.Price).HasColumnType("decimal(18,2)");
            builder.Property(z => z.PictureUrl).IsRequired();

            //This has already been done automatically by entity framework core.
            builder.HasOne(b => b.ProductBrand).WithMany()
                .HasForeignKey(p => p.ProductBrandId);
            builder.HasOne(t => t.ProductType).WithMany()
                .HasForeignKey(p => p.ProductTypeId);
        }
    }
}
