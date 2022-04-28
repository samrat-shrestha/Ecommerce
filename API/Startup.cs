using API.Extensions;
using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddApplicationServices();

            //for swagger
            services.AddSwaggerDocumentation();
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
            
            services.AddDbContext<StoreContext>(z => z.UseSqlServer(_configuration.GetConnectionString("DefaultConnection")));

            //Portion for redis.
            services.AddSingleton<IConnectionMultiplexer>(options =>
            {
                var configuration = ConfigurationOptions.Parse(_configuration.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(configuration);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //This is the added middleware for exception.
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                //Removed this default exception handling mechanism for dev only environment.
                //app.UseDeveloperExceptionPage();

                app.UseSwaggerDocumentation();
            }

            app.UseExceptionHandler("/errors");

            app.UseStatusCodePagesWithReExecute("/errors","?statusCode={0}");

            app.UseHttpsRedirection();

            app.UseRouting();

            //To serve the static files in wwwroot.
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
