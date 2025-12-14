using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Database setup with pooling + retry logic
builder.Services.AddDbContextPool<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure());
});

// 2. API + Swagger
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "AdditionApi", Version = "v1" });
});

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors();

// 3. Apply migrations only in development (recommended)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 4. Swagger only in dev
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AdditionApi v1");
        options.RoutePrefix = "swagger";
    });
}

// 5. Security middleware
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
app.UseHttpsRedirection();

// Default route
app.MapGet("/", () => "assign3-addition-api");

// Grouped routes
var storage = app.MapGroup("/api/storage");

// POST /api/storage
storage.MapPost("/", async (AppDbContext db, Record record) =>
{
    if (string.IsNullOrWhiteSpace(record.Key))
        return Results.BadRequest("Key is required.");

    if (await db.Records.AnyAsync(r => r.Key == record.Key))
        return Results.Conflict("Key already exists.");

    db.Records.Add(record);
    await db.SaveChangesAsync();

    return Results.Created($"/api/storage/{record.Key}", record);
});

// GET /api/storage/{key}
storage.MapGet("/{key}", async (AppDbContext db, string key) =>
{
    var result = await db.Records.FindAsync(key);
    return result is not null ? Results.Ok(result) : Results.NotFound();
});

// PUT /api/storage/{key}
storage.MapPut("/{key}", async (AppDbContext db, string key, Record record) =>
{
    if (string.IsNullOrWhiteSpace(key))
        return Results.BadRequest("Key is required.");

    if (record is null)
        return Results.BadRequest("Record data is required.");

    var existingRecord = await db.Records.FindAsync(key);
    if (existingRecord is null) 
    {
        // Create new record with the key from URL
        var newRecord = new Record { Key = key, Value = record.Value };
        db.Records.Add(newRecord);
        await db.SaveChangesAsync();
        
        return Results.Created($"/api/storage/{key}", newRecord);
    }

    // Update the existing record with new values
    existingRecord.Value = record.Value;
    
    await db.SaveChangesAsync();

    return Results.Ok(existingRecord);
});

// DELETE /api/storage/{key}
storage.MapDelete("/{key}", async (AppDbContext db, string key) =>
{
    var record = await db.Records.FindAsync(key);
    if (record is null)
        return Results.NotFound();

    db.Records.Remove(record);
    await db.SaveChangesAsync();

    return Results.NoContent();
});



app.Run();
