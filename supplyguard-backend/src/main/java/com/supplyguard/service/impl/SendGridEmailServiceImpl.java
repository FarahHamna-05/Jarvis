package com.supplyguard.service.impl;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.supplyguard.service.EmailService;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Service
public class SendGridEmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(SendGridEmailServiceImpl.class);

    @Value("${spring.mail.username:${GMAIL_USERNAME:}}")
    private String gmailUsername;

    @Value("${spring.mail.password:${GMAIL_APP_PASSWORD:}}")
    private String gmailPassword;

    @Value("${sendgrid.api.key:}")
    private String apiKey;

    @Value("${sendgrid.from.email:alerts@supplyguard.ai}")
    private String fromEmail;

    @Value("${sendgrid.from.name:SupplyGuard Autonomous Procurement}")
    private String fromName;

    // In-memory runtime override (allows configuring Gmail live via UI without restarting)
    private volatile String dynamicGmailUser = null;
    private volatile String dynamicGmailPass = null;

    @Override
    public void configureGmail(String username, String appPassword) {
        this.dynamicGmailUser = username != null ? username.trim() : null;
        this.dynamicGmailPass = appPassword != null ? appPassword.replace(" ", "").trim() : null;
        logger.info("Dynamic Gmail credentials updated for user: {}", dynamicGmailUser);
    }

    public String getEffectiveGmailUsername() {
        if (dynamicGmailUser != null && !dynamicGmailUser.isEmpty()) {
            return dynamicGmailUser;
        }
        return gmailUsername != null ? gmailUsername.trim() : "";
    }

    public String getEffectiveGmailPassword() {
        if (dynamicGmailPass != null && !dynamicGmailPass.isEmpty()) {
            return dynamicGmailPass;
        }
        return gmailPassword != null ? gmailPassword.replace(" ", "").trim() : "";
    }

    @Override
    public Map<String, Object> getEmailConfigStatus() {
        Map<String, Object> status = new HashMap<>();
        String gUser = getEffectiveGmailUsername();
        String gPass = getEffectiveGmailPassword();
        boolean hasGmail = !gUser.isEmpty() && !gPass.isEmpty();
        boolean hasSendGrid = apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("placeholder");

        status.put("activeProvider", hasGmail ? "GMAIL_SMTP" : (hasSendGrid ? "SENDGRID" : "NONE"));
        status.put("gmailConfigured", hasGmail);
        status.put("gmailUsername", hasGmail ? gUser : "");
        status.put("sendgridConfigured", hasSendGrid);
        status.put("sendgridFromEmail", fromEmail);
        status.put("fromName", fromName);
        return status;
    }

    @Override
    public EmailSendResult sendSupplierEmail(String toEmail, String subject, String body) {
        LocalDateTime now = LocalDateTime.now();

        if (toEmail == null || toEmail.trim().isEmpty()) {
            return EmailSendResult.builder()
                    .success(false)
                    .statusCode(400)
                    .message("Recipient email address cannot be null or empty")
                    .fromEmail(fromEmail)
                    .sentAt(now)
                    .build();
        }

        String effectiveGmail = getEffectiveGmailUsername();
        String effectivePass = getEffectiveGmailPassword();
        boolean hasGmail = !effectiveGmail.isEmpty() && !effectivePass.isEmpty();
        boolean hasSendGrid = apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("placeholder");

        // 1. Prioritize Gmail SMTP if user configured their real Gmail credentials
        if (hasGmail) {
            return sendViaGmailSmtp(toEmail.trim(), subject, body);
        }

        // 2. Fall back to SendGrid API if configured
        if (hasSendGrid) {
            return sendViaSendGrid(toEmail.trim(), subject, body);
        }

        // 3. Neither configured - return clear actionable failure
        String warningMsg = "SendGrid API key is not configured. Set SENDGRID_API_KEY environment variable or sendgrid.api.key in application.properties with a verified sender, or configure Gmail SMTP with GMAIL_USERNAME and GMAIL_APP_PASSWORD.";
        logger.warn(warningMsg);
        return EmailSendResult.builder()
                .success(false)
                .statusCode(401)
                .message(warningMsg)
                .toEmail(toEmail.trim())
                .fromEmail(fromEmail)
                .sentAt(now)
                .build();
    }

    /**
     * Sends genuine email from user's Gmail to supplier's Gmail via official smtp.gmail.com:587.
     */
    public EmailSendResult sendViaGmailSmtp(String toEmail, String subject, String body) {
        String username = getEffectiveGmailUsername();
        String password = getEffectiveGmailPassword();
        LocalDateTime now = LocalDateTime.now();

        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost("smtp.gmail.com");
            mailSender.setPort(587);
            mailSender.setUsername(username);
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.connectiontimeout", "10000");
            props.put("mail.smtp.timeout", "10000");
            props.put("mail.smtp.writetimeout", "10000");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            String senderDisplayName = (fromName != null && !fromName.isEmpty()) 
                    ? fromName + " (" + username + ")" 
                    : "SupplyGuard Procurement (" + username + ")";
            helper.setFrom(new InternetAddress(username, senderDisplayName));
            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(body != null ? body : "", false);

            logger.info("Dispatching genuine email via Gmail SMTP from: {} ({}) to supplier: {} (Subject: {})", 
                    username, senderDisplayName, toEmail, subject);
            mailSender.send(mimeMessage);

            String successMsg = String.format("Successfully delivered from %s to supplier %s via Gmail SMTP (250 OK)", username, toEmail.trim());
            logger.info(successMsg);

            return EmailSendResult.builder()
                    .success(true)
                    .statusCode(250)
                    .message(successMsg)
                    .messageId("gmail-msg-" + System.currentTimeMillis())
                    .toEmail(toEmail.trim())
                    .fromEmail(username)
                    .sentAt(now)
                    .build();

        } catch (MailAuthenticationException ex) {
            String errorMsg = "Gmail SMTP Authentication Failed: Invalid Google App Password. Ensure 2-Step Verification is enabled and generate a 16-character App Password at https://myaccount.google.com/apppasswords";
            logger.error(errorMsg);
            return EmailSendResult.builder()
                    .success(false)
                    .statusCode(401)
                    .message(errorMsg)
                    .toEmail(toEmail.trim())
                    .fromEmail(username)
                    .sentAt(now)
                    .build();
        } catch (Exception ex) {
            String errorMsg = "Gmail SMTP Delivery Failed: " + ex.getMessage();
            logger.error(errorMsg, ex);
            return EmailSendResult.builder()
                    .success(false)
                    .statusCode(500)
                    .message(errorMsg)
                    .toEmail(toEmail.trim())
                    .fromEmail(username)
                    .sentAt(now)
                    .build();
        }
    }

    /**
     * Sends email via SendGrid Java API.
     */
    private EmailSendResult sendViaSendGrid(String toEmail, String subject, String body) {
        LocalDateTime now = LocalDateTime.now();

        try {
            Email from = new Email(fromEmail != null ? fromEmail.trim() : "alerts@supplyguard.ai", fromName);
            Email to = new Email(toEmail.trim());
            Content content = new Content("text/plain", body != null ? body : "");

            Mail mail = new Mail(from, subject, to, content);
            SendGrid sg = new SendGrid(apiKey.trim());

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            logger.info("Dispatching real email via SendGrid to: {} (Subject: {})", toEmail, subject);
            Response response = sg.api(request);

            int status = response.getStatusCode();
            String responseBody = response.getBody();
            String messageId = null;

            if (response.getHeaders() != null && response.getHeaders().containsKey("X-Message-Id")) {
                messageId = response.getHeaders().get("X-Message-Id");
            }

            if (status >= 200 && status < 300) {
                String successMsg = String.format("Successfully queued for delivery by SendGrid (HTTP %d Accepted). Recipient: %s", status, toEmail.trim());
                logger.info(successMsg + (messageId != null ? " | MsgId: " + messageId : ""));
                return EmailSendResult.builder()
                        .success(true)
                        .statusCode(status)
                        .message(successMsg)
                        .messageId(messageId)
                        .toEmail(toEmail.trim())
                        .fromEmail(fromEmail)
                        .sentAt(now)
                        .build();
            } else {
                String errorMsg = String.format("SendGrid rejected message with HTTP %d: %s", status, responseBody);
                logger.error(errorMsg);
                return EmailSendResult.builder()
                        .success(false)
                        .statusCode(status)
                        .message(errorMsg)
                        .toEmail(toEmail.trim())
                        .fromEmail(fromEmail)
                        .sentAt(now)
                        .build();
            }

        } catch (IOException ex) {
            String errorMsg = "Network error connecting to SendGrid API: " + ex.getMessage();
            logger.error(errorMsg, ex);
            return EmailSendResult.builder()
                    .success(false)
                    .statusCode(500)
                    .message(errorMsg)
                    .toEmail(toEmail.trim())
                    .fromEmail(fromEmail)
                    .sentAt(now)
                    .build();
        } catch (Exception ex) {
            String errorMsg = "Unexpected error dispatching SendGrid email: " + ex.getMessage();
            logger.error(errorMsg, ex);
            return EmailSendResult.builder()
                    .success(false)
                    .statusCode(500)
                    .message(errorMsg)
                    .toEmail(toEmail.trim())
                    .fromEmail(fromEmail)
                    .sentAt(now)
                    .build();
        }
    }
}
