package com.cloudats.resume.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Resume parser — extracts structured data from PDF and DOCX files.
 */
@Service
public class ResumeParserService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Common regex patterns
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?linkedin\\.com/in/[\\w-]+/?");
    private static final Pattern GITHUB_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?github\\.com/[\\w-]+/?");

    // Section headers
    private static final List<String> SKILL_HEADERS = List.of("skills", "technical skills", "technologies", "tech stack", "core competencies", "proficiencies");
    private static final List<String> EDUCATION_HEADERS = List.of("education", "academic", "qualifications", "degrees");
    private static final List<String> EXPERIENCE_HEADERS = List.of("experience", "work experience", "professional experience", "employment", "work history");
    private static final List<String> PROJECT_HEADERS = List.of("projects", "personal projects", "academic projects", "key projects");
    private static final List<String> CERT_HEADERS = List.of("certifications", "certificates", "professional certifications", "licenses");

    // Known tech skills for extraction
    private static final Set<String> KNOWN_SKILLS = Set.of(
            "java", "python", "javascript", "typescript", "c++", "c#", "go", "rust", "kotlin", "swift",
            "react", "angular", "vue", "next.js", "node.js", "express", "spring", "spring boot", "django", "flask",
            "html", "css", "tailwind", "bootstrap", "sass", "less",
            "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb",
            "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "github actions",
            "git", "linux", "nginx", "apache", "kafka", "rabbitmq", "graphql", "rest", "grpc",
            "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
            "sql", "nosql", "microservices", "ci/cd", "devops", "agile", "scrum",
            "junit", "mockito", "selenium", "cypress", "jest", "mocha",
            "jira", "confluence", "figma", "postman", "swagger"
    );

    public Map<String, Object> parseResume(MultipartFile file) throws IOException {
        String text;
        String contentType = file.getContentType();

        if (contentType != null && contentType.contains("pdf")) {
            text = extractTextFromPdf(file.getInputStream());
        } else {
            text = extractTextFromDocx(file.getInputStream());
        }

        return parseText(text);
    }

    public Map<String, Object> parseText(String text) {
        Map<String, Object> result = new HashMap<>();

        result.put("rawText", text);
        result.put("fullName", extractName(text));
        result.put("email", extractEmail(text));
        result.put("phone", extractPhone(text));
        result.put("linkedinUrl", extractLinkedIn(text));
        result.put("githubUrl", extractGitHub(text));
        result.put("skills", extractSkills(text));
        result.put("projects", extractSection(text, PROJECT_HEADERS));
        result.put("education", extractSection(text, EDUCATION_HEADERS));
        result.put("experience", extractSection(text, EXPERIENCE_HEADERS));
        result.put("certifications", extractSection(text, CERT_HEADERS));

        return result;
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            StringBuilder sb = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                sb.append(paragraph.getText()).append("\n");
            }
            return sb.toString();
        }
    }

    private String extractName(String text) {
        String[] lines = text.split("\\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            // Skip lines that look like headers or contact info
            if (line.toLowerCase().contains("resume") || line.toLowerCase().contains("curriculum")) continue;
            if (EMAIL_PATTERN.matcher(line).find()) continue;
            if (PHONE_PATTERN.matcher(line).find() && line.length() < 20) continue;
            // First non-empty, non-header line is likely the name
            if (line.length() > 1 && line.length() < 60) {
                return line.replaceAll("[^a-zA-Z .'-]", "").trim();
            }
        }
        return "Unknown";
    }

    private String extractEmail(String text) {
        Matcher matcher = EMAIL_PATTERN.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private String extractPhone(String text) {
        Matcher matcher = PHONE_PATTERN.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private String extractLinkedIn(String text) {
        Matcher matcher = LINKEDIN_PATTERN.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private String extractGitHub(String text) {
        Matcher matcher = GITHUB_PATTERN.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private List<String> extractSkills(String text) {
        Set<String> found = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        String lowerText = text.toLowerCase();

        for (String skill : KNOWN_SKILLS) {
            if (lowerText.contains(skill.toLowerCase())) {
                // Capitalize properly
                found.add(skill.substring(0, 1).toUpperCase() + skill.substring(1));
            }
        }

        // Also try extracting from a skills section
        String skillSection = extractRawSection(text, SKILL_HEADERS);
        if (skillSection != null) {
            String[] tokens = skillSection.split("[,|•·\\n;/]");
            for (String token : tokens) {
                String cleaned = token.trim().replaceAll("[^a-zA-Z0-9.#+/ -]", "").trim();
                if (cleaned.length() > 1 && cleaned.length() < 30) {
                    found.add(cleaned);
                }
            }
        }

        return new ArrayList<>(found);
    }

    private List<String> extractSection(String text, List<String> headers) {
        String section = extractRawSection(text, headers);
        if (section == null) return List.of();

        List<String> items = new ArrayList<>();
        String[] lines = section.split("\\n");
        StringBuilder current = new StringBuilder();

        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) {
                if (!current.isEmpty()) {
                    items.add(current.toString().trim());
                    current = new StringBuilder();
                }
            } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.matches("^\\d+\\..*")) {
                if (!current.isEmpty()) {
                    items.add(current.toString().trim());
                    current = new StringBuilder();
                }
                current.append(line.replaceFirst("^[•\\-*]\\s*", "").replaceFirst("^\\d+\\.\\s*", ""));
            } else {
                if (!current.isEmpty()) current.append(" ");
                current.append(line);
            }
        }
        if (!current.isEmpty()) {
            items.add(current.toString().trim());
        }

        return items.stream().filter(s -> !s.isEmpty()).toList();
    }

    private String extractRawSection(String text, List<String> headers) {
        String[] lines = text.split("\\n");
        int startIdx = -1;

        for (int i = 0; i < lines.length; i++) {
            String lower = lines[i].trim().toLowerCase().replaceAll("[^a-z ]", "");
            for (String header : headers) {
                if (lower.equals(header) || lower.startsWith(header + " ") || lower.endsWith(" " + header)) {
                    startIdx = i + 1;
                    break;
                }
            }
            if (startIdx >= 0) break;
        }

        if (startIdx < 0) return null;

        // Collect until next section header or end
        StringBuilder section = new StringBuilder();
        List<String> allHeaders = new ArrayList<>();
        allHeaders.addAll(SKILL_HEADERS);
        allHeaders.addAll(EDUCATION_HEADERS);
        allHeaders.addAll(EXPERIENCE_HEADERS);
        allHeaders.addAll(PROJECT_HEADERS);
        allHeaders.addAll(CERT_HEADERS);

        for (int i = startIdx; i < lines.length; i++) {
            String lower = lines[i].trim().toLowerCase().replaceAll("[^a-z ]", "");
            boolean isHeader = false;
            for (String h : allHeaders) {
                if (lower.equals(h) || lower.startsWith(h + " ")) {
                    isHeader = true;
                    break;
                }
            }
            if (isHeader) break;
            section.append(lines[i]).append("\n");
        }

        return section.toString().trim();
    }

    public String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
