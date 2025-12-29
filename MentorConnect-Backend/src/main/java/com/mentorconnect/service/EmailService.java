package com.mentorconnect.service;

import com.mentorconnect.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@mentorconnect.com}")
    private String fromEmail;

    public void sendBookingConfirmation(Booking booking) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping email.");
            logEmailDetails(booking);
            return;
        }

        try {
            // Send to Mentee
            sendEmail(
                    booking.getMentee().getEmail(),
                    "Booking Confirmed - MentorConnect",
                    buildMenteeEmail(booking));

            // Send to Mentor
            sendEmail(
                    booking.getMentor().getUser().getEmail(),
                    "New Booking - MentorConnect",
                    buildMentorEmail(booking));
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            logEmailDetails(booking);
        }
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    private String buildMenteeEmail(Booking booking) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        StringBuilder sb = new StringBuilder();
        sb.append("Hi ").append(booking.getMentee().getName()).append(",\n\n");
        sb.append("Your mentorship session has been confirmed!\n\n");
        sb.append("Session Details:\n");
        sb.append("─────────────────────────────────\n");
        sb.append("Mentor: ").append(booking.getMentor().getUser().getName()).append("\n");
        sb.append("Date: ").append(booking.getScheduledDate().format(dateFormatter)).append("\n");
        sb.append("Time: ").append(booking.getScheduledTime().format(timeFormatter)).append("\n");
        sb.append("Duration: ").append(booking.getDuration()).append(" minutes\n");
        sb.append("Amount Paid: Rs.").append(booking.getPrice()).append("\n\n");
        sb.append("Join Meeting:\n");
        sb.append(booking.getMeetingLink()).append("\n\n");
        sb.append("Mentor Contact:\n");
        sb.append("WhatsApp: ").append(booking.getMentor().getWhatsappNumber()).append("\n\n");
        sb.append("Please join the meeting 5 minutes before the scheduled time.\n\n");
        sb.append("Best regards,\nMentorConnect Team");

        return sb.toString();
    }

    private String buildMentorEmail(Booking booking) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        StringBuilder sb = new StringBuilder();
        sb.append("Hi ").append(booking.getMentor().getUser().getName()).append(",\n\n");
        sb.append("You have a new booking!\n\n");
        sb.append("Session Details:\n");
        sb.append("─────────────────────────────────\n");
        sb.append("Mentee: ").append(booking.getMentee().getName()).append("\n");
        sb.append("Email: ").append(booking.getMentee().getEmail()).append("\n");
        sb.append("Date: ").append(booking.getScheduledDate().format(dateFormatter)).append("\n");
        sb.append("Time: ").append(booking.getScheduledTime().format(timeFormatter)).append("\n");
        sb.append("Duration: ").append(booking.getDuration()).append(" minutes\n");
        sb.append("Amount: Rs.").append(booking.getPrice()).append("\n\n");
        sb.append("Meeting Link:\n");
        sb.append(booking.getMeetingLink()).append("\n\n");
        sb.append("Notes from mentee:\n");
        sb.append(booking.getNotes() != null ? booking.getNotes() : "No notes provided").append("\n\n");
        sb.append("Please ensure you're available at the scheduled time.\n\n");
        sb.append("Best regards,\nMentorConnect Team");

        return sb.toString();
    }

    private void logEmailDetails(Booking booking) {
        System.out.println("\n========== EMAIL NOTIFICATION (DEMO MODE) ==========");
        System.out.println("To Mentee: " + booking.getMentee().getEmail());
        System.out.println("To Mentor: " + booking.getMentor().getUser().getEmail());
        System.out.println("Meeting Link: " + booking.getMeetingLink());
        System.out.println("Date: " + booking.getScheduledDate());
        System.out.println("Time: " + booking.getScheduledTime());
        System.out.println("=====================================================\n");
    }
}
