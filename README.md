# assign6-connecting-client-and-server
The assignment was introduced in Class #11. In the link you can find the slides from the presentation as well as a recording of the class.
`<link will be added after the class has been held>`

Example of CORS configuration
```
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();
```

Example of javascript to call a server
```
async getNumbers() {
  const response = await fetch('http://localhost:5262/number', { method: 'GET' });
  if (!response.ok) throw new Error(`Failed to fetch numbers (${response.status})`);
  
  const data = await response.json();
  return data;
}
```
## Instructions
Don't start this assignment until you have finshed assignment 5!

Clone this repository

Reuse your client from assignment 3 and your server from assignment 5.

Create a branch

Requirements:
- The web client should allow the user to summarize numbers
  - each entered number should be added to the sum
  - all entered numbers should be visible for the user (history)
  - the numbers should be persisted upon page load and stored in a database
  - (optional) Bonus points if you have a feature that allows the user to clear the numbers
- The web client should communicate with the database via a web API  (server)

Commit

Push your branch

Create a pull request `<your branch> => <main>`

Done!
