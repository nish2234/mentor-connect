package com.mentorconnect.controller;

import com.mentorconnect.dto.BookingDTO.*;
import com.mentorconnect.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(userDetails.getUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/mentor")
    public ResponseEntity<List<BookingResponse>> getMentorBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMentorBookings(userDetails.getUsername()));
    }

    @GetMapping("/mentee")
    public ResponseEntity<List<BookingResponse>> getMenteeBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMenteeBookings(userDetails.getUsername()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getUsername()));
    }
}
