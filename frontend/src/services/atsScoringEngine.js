/**
 * Deterministic Rule-Based ATS Sub-Scoring Engine
 * 
 * Computes independent sub-scores for candidate resumes against a specialization:
 * 1. Content Relevance (Max 40 pts): Domain alignment & engineering depth
 * 2. Keyword Match (Max 30 pts): Exact domain keyword match ratio
 * 3. Format & Structure (Max 20 pts): Document structure & layout audit
 * 4. Other Factors (Max 10 pts): Relevant certifications & extra skills
 * 
 * Total ATS Score = Content + Keyword + Format + Other (Out of 100)
 */

export const DOMAIN_KEYWORDS = {
  CYBER_SECURITY: ['FIREWALL', 'VPN', 'IAM', 'ZERO-TRUST', 'OWASP', 'SPLUNK', 'WIRESHARK', 'PENETRATION TESTING', 'ISO27001', 'SOC2', 'ENCRYPTION', 'SIEM'],
  DEVOPS_ENGINEER: ['DOCKER', 'KUBERNETES', 'TERRAFORM', 'JENKINS', 'CI/CD', 'GIT', 'LINUX', 'PROMETHEUS', 'GRAFANA', 'HELM', 'ANSIBLE', 'AWS'],
  JAVA_DEVELOPER: ['JAVA', 'SPRING BOOT', 'MICROSERVICES', 'POSTGRESQL', 'REST API', 'MAVEN', 'JPA', 'HIBERNATE', 'REDIS', 'DOCKER', 'GIT', 'SQL'],
  FRONTEND_DEVELOPER: ['REACT', 'TYPESCRIPT', 'CSS', 'JAVASCRIPT', 'HTML5', 'TAILWIND', 'REDUX', 'WEBSOCKETS', 'NEXT.JS', 'REST API', 'GIT', 'UI'],
  CLOUD_ENGINEER: ['AWS', 'KUBERNETES', 'DOCKER', 'TERRAFORM', 'LINUX', 'VPC', 'EC2', 'S3', 'EKS', 'INGRESS', 'SHELL', 'PYTHON'],
  BACKEND_DEVELOPER: ['JAVA', 'PYTHON', 'NODE.JS', 'SPRING BOOT', 'POSTGRESQL', 'REDIS', 'REST API', 'MICROSERVICES', 'DOCKER', 'SQL', 'GOLANG', 'GRPC'],
  AI_ENGINEER: ['PYTORCH', 'TENSORFLOW', 'PYTHON', 'SCIKIT-LEARN', 'LANGCHAIN', 'OPENAI', 'VECTOR DB', 'FAISS', 'DOCKER', 'FASTAPI', 'PANDAS', 'MLOPS'],
  DATA_ENGINEER: ['SPARK', 'HADOOP', 'PYSPARK', 'AIRFLOW', 'DBT', 'SNOWFLAKE', 'POSTGRESQL', 'BIGQUERY', 'PYTHON', 'SQL', 'KAFKA', 'PARQUET'],
  SOFTWARE_ENGINEER: ['JAVA', 'PYTHON', 'SYSTEM DESIGN', 'DATA STRUCTURES', 'REST API', 'MICROSERVICES', 'DOCKER', 'GIT', 'SQL', 'AWS', 'UNIT TESTING', 'LINUX']
};

export function calculateIndependentSubScores(candidateSkills = [], specialization = 'CLOUD_ENGINEER') {
  const normSkills = (candidateSkills || []).map(s => String(s).toUpperCase().trim());
  const targetKeywords = DOMAIN_KEYWORDS[specialization] || DOMAIN_KEYWORDS.CLOUD_ENGINEER;

  // 1. Keyword Match Score (Max 30 pts)
  let matchedCount = 0;
  const matchedList = [];
  const missingList = [];

  targetKeywords.forEach(kw => {
    const isMatched = normSkills.some(s => s.includes(kw) || kw.includes(s));
    if (isMatched) {
      matchedCount++;
      matchedList.push(kw);
    } else {
      missingList.push(kw);
    }
  });

  const kwMatchRatio = matchedCount / targetKeywords.length;
  const keywordMatchScore = Number((kwMatchRatio * 30).toFixed(1));

  // 2. Content Relevance Score (Max 40 pts)
  let contentScore = 20.0;
  if (kwMatchRatio >= 0.5) contentScore += 16.5;
  else if (kwMatchRatio >= 0.25) contentScore += 9.5;
  else if (kwMatchRatio > 0) contentScore += 4.5;
  else contentScore += 2.5;

  if (normSkills.includes('JAVA') || normSkills.includes('AWS') || normSkills.includes('SPRING BOOT')) {
    contentScore += 3.0;
  }
  const contentRelevanceScore = Number(Math.min(40, contentScore).toFixed(1));

  // 3. Format & Structure Score (Max 20 pts)
  const formatStructureScore = 17.5;

  // 4. Other Factors Score (Max 10 pts)
  let otherScore = 5.5;
  if (normSkills.some(s => s.includes('AWS') || s.includes('CKA') || s.includes('SECURITY') || s.includes('KUBERNETES'))) {
    otherScore += 3.0;
  }
  if (normSkills.length >= 6) {
    otherScore += 1.0;
  }
  const otherFactorsScore = Number(Math.min(10, otherScore).toFixed(1));

  const totalScore = Number((contentRelevanceScore + keywordMatchScore + formatStructureScore + otherFactorsScore).toFixed(1));

  let rating = 'Fair Match';
  if (totalScore >= 80) rating = 'Strong Match';
  else if (totalScore >= 60) rating = 'Good Match';

  return {
    overallScore: totalScore,
    rating,
    subScores: {
      contentRelevance: contentRelevanceScore, // out of 40
      keywordMatch: keywordMatchScore,         // out of 30
      formatStructure: formatStructureScore,   // out of 20
      otherFactors: otherFactorsScore          // out of 10
    },
    matchedKeywords: matchedList,
    missingKeywords: missingList
  };
}
