using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
using ToDoList.Bll.DTOs;
using ToDoList.Bll.Services;

namespace ToDoList.Server.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/admin")
            .RequireAuthorization()       // Require [Authorize] globally for this group
            .WithTags("User Management"); // Swagger section name

        // Delete User - requires Admin or SuperAdmin role
        userGroup.MapDelete("/delete", [Authorize(Roles = "Admin,SuperAdmin")]
        async (long userId, HttpContext httpContext, IUserService userService) =>
            {
                var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
                await userService.DeleteUserByIdAsync(userId, role);
                return Results.Ok();
            })
            .WithName("DeleteUser")
            .Produces(200)
            .Produces(404);
           

        // Update Role - requires SuperAdmin role
        userGroup.MapPatch("/updateRole", [Authorize(Roles = "SuperAdmin")]
        async (long userId, UserRoleDto userRoleDto, IUserService userService) =>
            {
                await userService.UpdateUserRoleAsync(userId, userRoleDto);
                return Results.Ok();
            })
            .WithName("UpdateUserRole");
    }
}
