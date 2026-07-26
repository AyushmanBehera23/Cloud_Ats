package com.cloudats.scoring.engine;

import java.util.*;

/**
 * Defines all 9 specializations with their distinct weighted scoring criteria.
 * Each specialization has specific required skills and weight distribution.
 */
public class SpecializationConfig {

    public record Specialization(
            String name,
            double skillsWeight,
            double experienceWeight,
            double educationWeight,
            double projectsWeight,
            double certificationsWeight,
            double formattingWeight,
            double keywordsWeight,
            List<String> requiredSkills,
            List<String> preferredSkills,
            List<String> keywords
    ) {}

    private static final Map<String, Specialization> SPECIALIZATIONS = new LinkedHashMap<>();

    static {
        SPECIALIZATIONS.put("CLOUD_ENGINEER", new Specialization(
                "Cloud Engineer",
                0.25, 0.25, 0.10, 0.15, 0.15, 0.05, 0.05,
                List.of("AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "Linux", "Networking"),
                List.of("Ansible", "CloudFormation", "Pulumi", "CI/CD", "Monitoring", "Prometheus", "Grafana"),
                List.of("cloud", "infrastructure", "IaC", "scalability", "high availability", "disaster recovery", "VPC", "IAM", "S3", "EC2", "Lambda")
        ));

        SPECIALIZATIONS.put("JAVA_DEVELOPER", new Specialization(
                "Java Developer",
                0.30, 0.25, 0.10, 0.15, 0.10, 0.05, 0.05,
                List.of("Java", "Spring", "Spring Boot", "JPA", "Hibernate", "SQL", "REST", "Maven"),
                List.of("Microservices", "Kafka", "RabbitMQ", "JUnit", "Mockito", "Docker", "PostgreSQL", "Redis"),
                List.of("java", "spring", "microservices", "API", "multithreading", "JVM", "garbage collection", "design patterns", "SOLID")
        ));

        SPECIALIZATIONS.put("BACKEND_DEVELOPER", new Specialization(
                "Backend Developer",
                0.30, 0.25, 0.10, 0.15, 0.05, 0.05, 0.10,
                List.of("Java", "Python", "SQL", "REST", "Git", "Docker"),
                List.of("Node.js", "Go", "GraphQL", "Redis", "MongoDB", "Kafka", "Microservices", "Kubernetes"),
                List.of("backend", "API", "database", "server", "scalability", "caching", "authentication", "authorization")
        ));

        SPECIALIZATIONS.put("FRONTEND_DEVELOPER", new Specialization(
                "Frontend Developer",
                0.30, 0.20, 0.10, 0.20, 0.05, 0.10, 0.05,
                List.of("JavaScript", "TypeScript", "React", "HTML", "CSS", "Git"),
                List.of("Angular", "Vue", "Next.js", "Tailwind", "Redux", "Webpack", "Jest", "Cypress", "Figma"),
                List.of("frontend", "UI", "UX", "responsive", "accessibility", "performance", "SPA", "component", "state management")
        ));

        SPECIALIZATIONS.put("DEVOPS_ENGINEER", new Specialization(
                "DevOps Engineer",
                0.25, 0.25, 0.10, 0.15, 0.15, 0.05, 0.05,
                List.of("Linux", "Docker", "Kubernetes", "CI/CD", "Git", "Terraform", "Jenkins"),
                List.of("Ansible", "AWS", "Azure", "Prometheus", "Grafana", "Helm", "ArgoCD", "GitOps"),
                List.of("devops", "automation", "pipeline", "deployment", "infrastructure", "monitoring", "logging", "SRE", "incident")
        ));

        SPECIALIZATIONS.put("SOFTWARE_ENGINEER", new Specialization(
                "Software Engineer",
                0.25, 0.25, 0.15, 0.15, 0.05, 0.05, 0.10,
                List.of("Java", "Python", "Git", "SQL", "REST"),
                List.of("JavaScript", "TypeScript", "Docker", "AWS", "Microservices", "Agile", "Scrum"),
                List.of("software", "engineering", "design patterns", "algorithms", "data structures", "OOP", "system design", "testing")
        ));

        SPECIALIZATIONS.put("DATA_ENGINEER", new Specialization(
                "Data Engineer",
                0.30, 0.25, 0.10, 0.15, 0.10, 0.05, 0.05,
                List.of("Python", "SQL", "Spark", "Kafka", "Airflow", "ETL"),
                List.of("Hadoop", "Flink", "Snowflake", "BigQuery", "Redshift", "dbt", "AWS", "Docker"),
                List.of("data", "pipeline", "ETL", "warehouse", "lake", "batch", "streaming", "transformation", "schema")
        ));

        SPECIALIZATIONS.put("AI_ENGINEER", new Specialization(
                "AI Engineer",
                0.30, 0.20, 0.15, 0.20, 0.05, 0.05, 0.05,
                List.of("Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP"),
                List.of("Scikit-learn", "Pandas", "NumPy", "Computer Vision", "LLM", "MLOps", "Docker", "AWS"),
                List.of("AI", "machine learning", "neural network", "model", "training", "inference", "NLP", "computer vision", "LLM", "GPT")
        ));

        SPECIALIZATIONS.put("CYBER_SECURITY", new Specialization(
                "Cyber Security",
                0.25, 0.25, 0.10, 0.15, 0.20, 0.05, 0.00,
                List.of("Network Security", "Linux", "Python", "Firewalls", "SIEM", "Penetration Testing"),
                List.of("Wireshark", "Metasploit", "Nmap", "SOC", "Incident Response", "Compliance", "Cryptography", "AWS Security"),
                List.of("security", "vulnerability", "threat", "compliance", "audit", "encryption", "penetration", "forensics", "incident", "OWASP")
        ));
    }

    public static Specialization get(String key) {
        return SPECIALIZATIONS.get(key.toUpperCase().replace(" ", "_").replace("-", "_"));
    }

    public static Map<String, Specialization> getAll() {
        return Collections.unmodifiableMap(SPECIALIZATIONS);
    }

    public static List<String> getSpecializationNames() {
        return SPECIALIZATIONS.values().stream().map(Specialization::name).toList();
    }
}
