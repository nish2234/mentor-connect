package com.mentorconnect.dto;

import com.mentorconnect.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDTO {

    @Data
    public static class BookingRequest {
        @NotNull(message = "Mentor ID is required")
        private Long mentorId;

        @NotNull(message = "Scheduled date is required")
        private LocalDate scheduledDate;

        @NotNull(message = "Scheduled time is required")
        private LocalTime scheduledTime;

        private String notes;
    }

    @Data
    public static class BookingResponse {
        private Long id;
        private Long mentorId;
        private String mentorName;
        private String mentorEmail;
        private Long menteeId;
        private String menteeName;
        private String menteeEmail;
        private LocalDate scheduledDate;
        private LocalTime scheduledTime;
        private Integer duration;
        private Booking.BookingStatus status;
        private String meetingLink;
        private BigDecimal price;
        private String notes;
        private LocalDateTime createdAt;

        public static BookingResponse fromEntity(Booking booking) {
            BookingResponse response = new BookingResponse();
            response.setId(booking.getId());
            response.setMentorId(booking.getMentor().getId());
            response.setMentorName(booking.getMentor().getUser().getName());
            response.setMentorEmail(booking.getMentor().getUser().getEmail());
            response.setMenteeId(booking.getMentee().getId());
            response.setMenteeName(booking.getMentee().getName());
            response.setMenteeEmail(booking.getMentee().getEmail());
            response.setScheduledDate(booking.getScheduledDate());
            response.setScheduledTime(booking.getScheduledTime());
            response.setDuration(booking.getDuration());
            response.setStatus(booking.getStatus());
            response.setMeetingLink(booking.getMeetingLink());
            response.setPrice(booking.getPrice());
            response.setNotes(booking.getNotes());
            response.setCreatedAt(booking.getCreatedAt());
            return response;
        }
    }
}
