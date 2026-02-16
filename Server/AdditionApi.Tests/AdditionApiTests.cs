using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;


namespace AdditionApi.Tests;

public class AdditionApiTests : IClassFixture<IntegrationTestFixture>
{
    private readonly HttpClient _client;

    public AdditionApiTests(IntegrationTestFixture fixture)
    {
        _client = fixture.CreateClient();
    }

    [Fact]
    public async Task Post_DuplicateKeys_ShouldBothBeSaved()
    {
        var data = new { Key = "45", Value = "v1" };

        var response1 = await _client.PostAsJsonAsync("/api/addition", data);
        var response2 = await _client.PostAsJsonAsync("/api/addition", data);
        
        var allElements = await _client.GetFromJsonAsync<List<dynamic>>("/api/addition");

        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);
        Assert.Equal(HttpStatusCode.Created, response2.StatusCode);
        Assert.True(allElements?.Count >= 2); 
    }

    [Fact]
    public async Task GetAll_ShouldReturnListOfElements()
    {
        await _client.PostAsJsonAsync("/api/addition", new { Key = "10", Value = "ten" });

        var response = await _client.GetAsync("/api/addition");
        var content = await response.Content.ReadFromJsonAsync<List<object>>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.NotEmpty(content);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_AndClearDatabase()
    {
        await _client.PostAsJsonAsync("/api/addition", new { Key = "temp", Value = "data" });

        var deleteResponse = await _client.DeleteAsync("/api/addition");
        var getResponse = await _client.GetFromJsonAsync<List<object>>("/api/addition");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Empty(getResponse); 
    }

    [Fact]
    public async Task Post_MultipleTimes_ShouldAllowDuplicates()
    {
        var item = new { Key = "10", Value = "v1" };

        await _client.PostAsJsonAsync("/api/addition", item);
        await _client.PostAsJsonAsync("/api/addition", item);

        var response = await _client.GetAsync("/api/addition");
        var list = await response.Content.ReadFromJsonAsync<List<dynamic>>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(list.Count >= 2);
    }

    [Fact]
    public async Task Delete_ShouldClearAllAndReturnNoContent()
    {
        var response = await _client.DeleteAsync("/api/addition");
        var getResponse = await _client.GetFromJsonAsync<List<dynamic>>("/api/addition");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Empty(getResponse);
    }
}
