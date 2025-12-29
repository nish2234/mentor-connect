package com.mentorconnect.repository;

import com.mentorconnect.entity.Booking;
import com.mentorconnect.entity.MentorProfile;
import com.mentorconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByMentorOrderByScheduledDateDescScheduledTimeDesc(MentorProfile mentor);

    List<Booking> findByMenteeOrderByScheduledDateDescScheduledTimeDesc(User mentee);

    List<Booking> findByMentorIdOrderByScheduledDateDescScheduledTimeDesc(Long mentorId);

    List<Booking> findByMenteeIdOrderByScheduledDateDescScheduledTimeDesc(Long menteeId);

    @Query("SELECT b FROM Booking b WHERE b.mentor.id = :mentorId AND b.scheduledDate = :date AND b.status != 'CANCELLED'")
    List<Booking> findByMentorIdAndScheduledDate(@Param("mentorId") Long mentorId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.mentor.id = :mentorId AND b.scheduledDate = :date AND b.scheduledTime = :time AND b.status != 'CANCELLED'")
    List<Booking> findConflictingBookings(@Param("mentorId") Long mentorId, @Param("date") LocalDate date,
            @Param("time") LocalTime time);

    List<Booking> findByStatus(Booking.BookingStatus status);
}
