package com.mentorconnect.dto;

import com.mentorconnect.entity.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTO {

    @Data
    public static class PaymentRequest {
        @NotNull(message = "Booking ID is required")
        private Long bookingId;

        private String paymentMethod = "DEMO";
    }

    @Data
    public static class PaymentResponse {
        private Long id;
        private Long bookingId;
        private BigDecimal amount;
        private String currency;
        private String transactionId;
        private Payment.PaymentStatus status;
        private String paymentMethod;
        private LocalDateTime createdAt;

        public static PaymentResponse fromEntity(Payment payment) {
            PaymentResponse response = new PaymentResponse();
            response.setId(payment.getId());
            response.setBookingId(payment.getBooking().getId());
            response.setAmount(payment.getAmount());
            response.setCurrency(payment.getCurrency());
            response.setTransactionId(payment.getTransactionId());
            response.setStatus(payment.getStatus());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setCreatedAt(payment.getCreatedAt());
            return response;
        }
    }
}
