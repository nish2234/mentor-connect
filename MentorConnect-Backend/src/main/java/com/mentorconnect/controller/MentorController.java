package com.mentorconnect.controller;

import com.mentorconnect.dto.AvailabilityDTO.*;
import com.mentorconnect.dto.MentorDTO.*;
import com.mentorconnect.service.MentorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
@CrossOrigin
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @GetMapping
    public ResponseEntity<List<ProfileResponse>> getAllMentors() {
        return ResponseEntity.ok(mentorService.getAllMentors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponse> getMentorById(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProfileResponse>> searchMentors(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String collegeName,
            @RequestParam(required = false) String experienceType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        SearchRequest request = new SearchRequest();
        request.setCompany(company);
        request.setSkill(skill);
        request.setCollegeName(collegeName);
        if (experienceType != null) {
            request.setExperienceType(
                    com.mentorconnect.entity.MentorProfile.ExperienceType.valueOf(experienceType));
        }
        if (minPrice != null) {
            request.setMinPrice(java.math.BigDecimal.valueOf(minPrice));
        }
        if (maxPrice != null) {
            request.setMaxPrice(java.math.BigDecimal.valueOf(maxPrice));
        }

        return ResponseEntity.ok(mentorService.searchMentors(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(mentorService.createOrUpdateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/profile/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // Get mentor profile by user email
        return ResponseEntity.ok(mentorService.getMentorByEmail(userDetails.getUsername()));
    }

    @PostMapping("/availability")
    public ResponseEntity<List<AvailabilityResponse>> setAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BulkAvailabilityRequest request) {
        return ResponseEntity.ok(mentorService.setAvailability(userDetails.getUsername(), request));
    }

    @GetMapping("/{mentorId}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(@PathVariable Long mentorId) {
        return ResponseEntity.ok(mentorService.getAvailability(mentorId));
    }
}
