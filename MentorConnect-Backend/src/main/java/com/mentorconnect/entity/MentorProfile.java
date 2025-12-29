package com.mentorconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mentor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "whatsapp_number", nullable = false)
    private String whatsappNumber;

    @Column(name = "college_name", nullable = false)
    private String collegeName;

    @Column(name = "passout_year", nullable = false)
    private Integer passoutYear;

    @Column(name = "current_company", nullable = false)
    private String currentCompany;

    @ElementCollection
    @CollectionTable(name = "mentor_previous_companies", joinColumns = @JoinColumn(name = "mentor_id"))
    @Column(name = "company_name")
    @Builder.Default
    private List<String> previousCompanies = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_type", nullable = false)
    private ExperienceType experienceType;

    @ElementCollection
    @CollectionTable(name = "mentor_skills", joinColumns = @JoinColumn(name = "mentor_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "session_price", nullable = false)
    private BigDecimal sessionPrice;

    @Column(name = "session_duration")
    @Builder.Default
    private Integer sessionDuration = 30; // minutes

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ExperienceType {
        FULLTIME, INTERNSHIP, BOTH
    }
}
