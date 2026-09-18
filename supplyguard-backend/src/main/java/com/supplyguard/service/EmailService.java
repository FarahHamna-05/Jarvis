package com.supplyguard.service;

import lombok.*;

import java.time.LocalDateTime;

public interface EmailService {

    /**
     * Sends an email to the supplier's real inbox via Gmail SMTP or the SendGrid API.
     *
     * @param toEmail The recipient email address
     * @param subject The email subject line
     * @param body    The plain text or markdown email body
     * @return Result containing success flag, HTTP status code, and message/ID
     */
    EmailSendResult sendSupplierEmail(String toEmail, String subject, String body);

    /**
     * Returns current email delivery configuration state (Gmail / SendGrid).
     */
    java.util.Map<String, Object> getEmailConfigStatus();

    /**
     * Dynamically update Gmail SMTP sender credentials at runtime.
     */
    void configureGmail(String username, String appPassword);

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    class EmailSendResult {
        private boolean success;
        private int statusCode;
        private String message;
        private String messageId;
        private String toEmail;
        private String fromEmail;
        private LocalDateTime sentAt;
    }
}
