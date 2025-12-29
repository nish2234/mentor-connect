package com.mentorconnect.service;

import com.mentorconnect.dto.AvailabilityDTO.*;
import com.mentorconnect.dto.MentorDTO.*;
import com.mentorconnect.entity.Availability;
import com.mentorconnect.entity.MentorProfile;
import com.mentorconnect.entity.User;
import com.mentorconnect.repository.AvailabilityRepository;
import com.mentorconnect.repository.MentorProfileRepository;
import com.mentorconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MentorService {

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProfileResponse> getAllMentors() {
        return mentorProfileRepository.findByIsActiveTrue().stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    public ProfileResponse getMentorById(Long id) {
        MentorProfile profile = mentorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        return toProfileResponse(profile);
    }

    public ProfileResponse getMentorByUserId(Long userId) {
        MentorProfile profile = mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found"));
        return toProfileResponse(profile);
    }

    public ProfileResponse getMentorByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MentorProfile profile = mentorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found"));
        return toProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse createOrUpdateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.MENTOR) {
            throw new RuntimeException("Only mentors can create profiles");
        }

        MentorProfile profile = mentorProfileRepository.findByUser(user)
                .orElse(MentorProfile.builder().user(user).build());

        profile.setWhatsappNumber(request.getWhatsappNumber());
        profile.setCollegeName(request.getCollegeName());
        profile.setPassoutYear(request.getPassoutYear());
        profile.setCurrentCompany(request.getCurrentCompany());
        profile.setPreviousCompanies(request.getPreviousCompanies());
        profile.setExperienceType(request.getExperienceType());
        profile.setSkills(request.getSkills());
        profile.setBio(request.getBio());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setProfileImageUrl(request.getProfileImageUrl());
        profile.setSessionPrice(request.getSessionPrice());
        profile.setSessionDuration(request.getSessionDuration() != null ? request.getSessionDuration() : 30);

        profile = mentorProfileRepository.save(profile);
        return toProfileResponse(profile);
    }

    public List<ProfileResponse> searchMentors(SearchRequest request) {
        List<MentorProfile> mentors = mentorProfileRepository.findByIsActiveTrue();

        return mentors.stream()
                .filter(m -> request.getCompany() == null ||
                        m.getCurrentCompany().toLowerCase().contains(request.getCompany().toLowerCase()) ||
                        m.getPreviousCompanies().stream()
                                .anyMatch(c -> c.toLowerCase().contains(request.getCompany().toLowerCase())))
                .filter(m -> request.getSkill() == null ||
                        m.getSkills().stream()
                                .anyMatch(s -> s.toLowerCase().contains(request.getSkill().toLowerCase())))
                .filter(m -> request.getCollegeName() == null ||
                        m.getCollegeName().toLowerCase().contains(request.getCollegeName().toLowerCase()))
                .filter(m -> request.getExperienceType() == null ||
                        m.getExperienceType() == request.getExperienceType())
                .filter(m -> request.getMinPrice() == null ||
                        m.getSessionPrice().compareTo(request.getMinPrice()) >= 0)
                .filter(m -> request.getMaxPrice() == null ||
                        m.getSessionPrice().compareTo(request.getMaxPrice()) <= 0)
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<AvailabilityResponse> setAvailability(String email, BulkAvailabilityRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MentorProfile profile = mentorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found"));

        // Clear existing availabilities
        availabilityRepository.deleteByMentorId(profile.getId());

        List<Availability> availabilities = request.getAvailabilities().stream()
                .map(req -> Availability.builder()
                        .mentor(profile)
                        .dayOfWeek(req.getDayOfWeek())
                        .startTime(req.getStartTime())
                        .endTime(req.getEndTime())
                        .isActive(true)
                        .build())
                .collect(Collectors.toList());

        availabilities = availabilityRepository.saveAll(availabilities);

        return availabilities.stream()
                .map(AvailabilityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AvailabilityResponse> getAvailability(Long mentorId) {
        return availabilityRepository.findByMentorIdAndIsActiveTrue(mentorId).stream()
                .map(AvailabilityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private ProfileResponse toProfileResponse(MentorProfile profile) {
        ProfileResponse response = ProfileResponse.fromEntity(profile);
        List<AvailabilityResponse> availabilities = availabilityRepository
                .findByMentorAndIsActiveTrue(profile).stream()
                .map(AvailabilityResponse::fromEntity)
                .collect(Collectors.toList());
        response.setAvailabilities(availabilities);
        return response;
    }
}
