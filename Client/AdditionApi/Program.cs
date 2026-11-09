using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var storage = new ConcurrentDictionary<string, string>();

// Replaces localStorage.setItem(key, value)
app.MapPut("/storage/{key}", (string key, [FromBody] StorageValue body) =>
{
    storage[key] = body.Value;
    return Results.NoContent();
});

// Replaces localStorage.getItem(key)
app.MapGet("/storage/{key}", (string key) =>
{
    if (!storage.TryGetValue(key, out var value))
        return Results.NotFound();
    return Results.Ok(new StorageValue(value));
});

app.Run();

record StorageValue(string Value);
