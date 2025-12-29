package com.mentorconnect.repository;

import com.mentorconnect.entity.MentorProfile;
import com.mentorconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MentorProfileRepository
        extends JpaRepository<MentorProfile, Long>, JpaSpecificationExecutor<MentorProfile> {

    Optional<MentorProfile> findByUser(User user);

    Optional<MentorProfile> findByUserId(Long userId);

    List<MentorProfile> findByIsActiveTrue();

    @Query("SELECT m FROM MentorProfile m WHERE m.isActive = true AND " +
            "(LOWER(m.currentCompany) LIKE LOWER(CONCAT('%', :company, '%')) OR " +
            ":company MEMBER OF m.previousCompanies)")
    List<MentorProfile> findByCompany(@Param("company") String company);

    @Query("SELECT m FROM MentorProfile m WHERE m.isActive = true AND :skill MEMBER OF m.skills")
    List<MentorProfile> findBySkill(@Param("skill") String skill);

    @Query("SELECT m FROM MentorProfile m WHERE m.isActive = true AND m.collegeName = :collegeName")
    List<MentorProfile> findByCollegeName(@Param("collegeName") String collegeName);
}
