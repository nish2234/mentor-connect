package com.mentorconnect.dto;

import com.mentorconnect.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String phone;

        @NotNull(message = "Role is required")
        private User.Role role;
    }

    @Data
    public static class LoginRequest {
        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private User.Role role;

        public AuthResponse(String token, Long id, String name, String email, User.Role role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private User.Role role;

        public static UserResponse fromUser(User user) {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setRole(user.getRole());
            return response;
        }
    }
}
