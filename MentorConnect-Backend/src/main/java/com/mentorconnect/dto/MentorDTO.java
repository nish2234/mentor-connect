package com.mentorconnect.dto;

import com.mentorconnect.entity.MentorProfile;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MentorDTO {

    @Data
    public static class ProfileRequest {
        @NotBlank(message = "WhatsApp number is required")
        private String whatsappNumber;

        @NotBlank(message = "College name is required")
        private String collegeName;

        @NotNull(message = "Passout year is required")
        @Min(value = 1990, message = "Invalid passout year")
        @Max(value = 2030, message = "Invalid passout year")
        private Integer passoutYear;

        @NotBlank(message = "Current company is required")
        private String currentCompany;

        private List<String> previousCompanies = new ArrayList<>();

        @NotNull(message = "Experience type is required")
        private MentorProfile.ExperienceType experienceType;

        @NotEmpty(message = "At least one skill is required")
        private List<String> skills = new ArrayList<>();

        private String bio;

        private String linkedinUrl;

        private String profileImageUrl;

        @NotNull(message = "Session price is required")
        @DecimalMin(value = "0", message = "Price cannot be negative")
        @DecimalMax(value = "1000", message = "Price cannot exceed ₹1000")
        private BigDecimal sessionPrice;

        private Integer sessionDuration = 30;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private String whatsappNumber;
        private String collegeName;
        private Integer passoutYear;
        private String currentCompany;
        private List<String> previousCompanies;
        private MentorProfile.ExperienceType experienceType;
        private List<String> skills;
        private String bio;
        private String linkedinUrl;
        private String profileImageUrl;
        private BigDecimal sessionPrice;
        private Integer sessionDuration;
        private Boolean isActive;
        private List<AvailabilityDTO.AvailabilityResponse> availabilities;

        public static ProfileResponse fromEntity(MentorProfile profile) {
            ProfileResponse response = new ProfileResponse();
            response.setId(profile.getId());
            response.setUserId(profile.getUser().getId());
            response.setUserName(profile.getUser().getName());
            response.setUserEmail(profile.getUser().getEmail());
            response.setWhatsappNumber(profile.getWhatsappNumber());
            response.setCollegeName(profile.getCollegeName());
            response.setPassoutYear(profile.getPassoutYear());
            response.setCurrentCompany(profile.getCurrentCompany());
            response.setPreviousCompanies(profile.getPreviousCompanies());
            response.setExperienceType(profile.getExperienceType());
            response.setSkills(profile.getSkills());
            response.setBio(profile.getBio());
            response.setLinkedinUrl(profile.getLinkedinUrl());
            response.setProfileImageUrl(profile.getProfileImageUrl());
            response.setSessionPrice(profile.getSessionPrice());
            response.setSessionDuration(profile.getSessionDuration());
            response.setIsActive(profile.getIsActive());
            return response;
        }
    }

    @Data
    public static class SearchRequest {
        private String company;
        private String skill;
        private String collegeName;
        private MentorProfile.ExperienceType experienceType;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
    }
}
