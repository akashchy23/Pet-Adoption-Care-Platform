using PetHaven.Api.Services;
using PetHaven.Api.Settings;

var builder = WebApplication.CreateBuilder(args);

// 1. Bind MongoDbSettings configuration
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// 2. Register Services Dependency Injection
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddSingleton<IPetService, PetService>();
builder.Services.AddSingleton<IVetService, VetService>();
builder.Services.AddSingleton<IAppointmentService, AppointmentService>();
builder.Services.AddSingleton<IAdoptionService, AdoptionService>();
builder.Services.AddSingleton<ICommunityService, CommunityService>();
builder.Services.AddSingleton<ILostFoundService, LostFoundService>();

// 3. Add Controllers & OpenAPI/Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "PetHaven API - MongoDB Integration",
        Version = "v1",
        Description = "C# ASP.NET Core Backend with MongoDB persistence for User Registration & Profile Management"
    });
});

// 4. Configure CORS for Frontend requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
