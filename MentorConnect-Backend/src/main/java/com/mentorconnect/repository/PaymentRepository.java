package com.mentorconnect.repository;

import com.mentorconnect.entity.Booking;
import com.mentorconnect.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBooking(Booking booking);

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByTransactionId(String transactionId);
}
