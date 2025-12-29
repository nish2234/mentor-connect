package com.mentorconnect.service;

import com.mentorconnect.dto.PaymentDTO.*;
import com.mentorconnect.entity.Booking;
import com.mentorconnect.entity.Payment;
import com.mentorconnect.repository.BookingRepository;
import com.mentorconnect.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }

        // Check if payment already exists
        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking");
        }

        // Create demo payment (simulated)
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getPrice())
                .currency("INR")
                .transactionId("DEMO_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .status(Payment.PaymentStatus.SUCCESS)
                .paymentMethod(request.getPaymentMethod())
                .build();

        payment = paymentRepository.save(payment);

        // Confirm the booking after successful payment
        bookingService.confirmBooking(booking.getId());

        return PaymentResponse.fromEntity(payment);
    }

    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return PaymentResponse.fromEntity(payment);
    }
}
