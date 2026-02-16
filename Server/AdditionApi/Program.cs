using AdditionApi;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

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
app.UseCors();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Database.ConnectionString = connectionString;
await Database.SetupAsync();


app.MapGet("/", () =>
{
    return "Addition API";
});

app.MapGet("/api/addition/{key}",(string key) =>
{   
    var value = Database.GetValue(key);
    if (value != null)
    {
        return Results.Ok(new {key, value});
    }

    return Results.NotFound(new { message = $"Key {key} not found" });
});

app.MapGet("/api/addition", () =>
{
    var allElements = Database.GetAllValues();
    
    return Results.Ok(allElements);
});

app.MapPost("/api/addition", async ([FromBody] StorageData storageData) =>
{   
    await Database.SetValue(storageData.Key,storageData.Value);

    return Results.Created($"/api/addition", new { key = storageData.Key, value =  storageData.Value});
});

app.MapDelete("/api/addition", async () =>
{   
    await Database.CleanAllValues();

    return Results.NoContent();
});


app.Run();

record StorageData(string Key, string Value);

public partial class Program { }