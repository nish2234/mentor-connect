package com.mentorconnect.repository;

import com.mentorconnect.entity.Availability;
import com.mentorconnect.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByMentorAndIsActiveTrue(MentorProfile mentor);

    List<Availability> findByMentorIdAndIsActiveTrue(Long mentorId);

    List<Availability> findByMentorIdAndDayOfWeekAndIsActiveTrue(Long mentorId, DayOfWeek dayOfWeek);

    void deleteByMentorId(Long mentorId);
}
