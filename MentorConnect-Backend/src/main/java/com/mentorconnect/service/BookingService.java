package com.mentorconnect.service;

import com.mentorconnect.dto.BookingDTO.*;
import com.mentorconnect.entity.Booking;
import com.mentorconnect.entity.MentorProfile;
import com.mentorconnect.entity.User;
import com.mentorconnect.repository.BookingRepository;
import com.mentorconnect.repository.MentorProfileRepository;
import com.mentorconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MentorProfileRepository mentorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public BookingResponse createBooking(String email, BookingRequest request) {
        User mentee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (mentee.getRole() != User.Role.MENTEE) {
            throw new RuntimeException("Only mentees can create bookings");
        }

        MentorProfile mentor = mentorProfileRepository.findById(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                mentor.getId(), request.getScheduledDate(), request.getScheduledTime());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("This time slot is already booked");
        }

        Booking booking = Booking.builder()
                .mentor(mentor)
                .mentee(mentee)
                .scheduledDate(request.getScheduledDate())
                .scheduledTime(request.getScheduledTime())
                .duration(mentor.getSessionDuration())
                .price(mentor.getSessionPrice())
                .notes(request.getNotes())
                .status(Booking.BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        // Generate Jitsi Meet Link
        String meetingId = UUID.randomUUID().toString().substring(0, 8);
        String meetingLink = "https://meet.jit.si/mentorconnect-" + meetingId;
        booking.setMeetingLink(meetingLink);

        booking = bookingRepository.save(booking);

        // Send confirmation emails
        try {
            emailService.sendBookingConfirmation(booking);
        } catch (Exception e) {
            // Log error but don't fail the booking
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return BookingResponse.fromEntity(booking);
    }

    public List<BookingResponse> getMentorBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MentorProfile mentor = mentorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found"));

        return bookingRepository.findByMentorIdOrderByScheduledDateDescScheduledTimeDesc(mentor.getId())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getMenteeBookings(String email) {
        User mentee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByMenteeIdOrderByScheduledDateDescScheduledTimeDesc(mentee.getId())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify ownership
        boolean isMentor = booking.getMentor().getUser().getId().equals(user.getId());
        boolean isMentee = booking.getMentee().getId().equals(user.getId());

        if (!isMentor && !isMentee) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        return BookingResponse.fromEntity(booking);
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return BookingResponse.fromEntity(booking);
    }
}
