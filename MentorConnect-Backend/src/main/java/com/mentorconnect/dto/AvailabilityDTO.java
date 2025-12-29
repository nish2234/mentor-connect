package com.mentorconnect.dto;

import com.mentorconnect.entity.Availability;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public class AvailabilityDTO {

    @Data
    public static class AvailabilityRequest {
        @NotNull(message = "Day of week is required")
        private DayOfWeek dayOfWeek;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        @NotNull(message = "End time is required")
        private LocalTime endTime;
    }

    @Data
    public static class BulkAvailabilityRequest {
        private List<AvailabilityRequest> availabilities;
    }

    @Data
    public static class AvailabilityResponse {
        private Long id;
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private Boolean isActive;

        public static AvailabilityResponse fromEntity(Availability availability) {
            AvailabilityResponse response = new AvailabilityResponse();
            response.setId(availability.getId());
            response.setDayOfWeek(availability.getDayOfWeek());
            response.setStartTime(availability.getStartTime());
            response.setEndTime(availability.getEndTime());
            response.setIsActive(availability.getIsActive());
            return response;
        }
    }
}
