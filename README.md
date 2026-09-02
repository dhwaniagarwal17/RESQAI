# RESQAI

## AI-Assisted Humanitarian Disaster Message Classification

RESQAI is an AI-assisted humanitarian information processing system designed to classify disaster-related social media messages and extract useful contextual information from them.

During disasters such as earthquakes, floods, hurricanes, and wildfires, social media platforms generate large amounts of real-time information. These messages can contain emergency requests, reports of injuries, infrastructure damage, evacuation information, missing-person reports, rescue efforts, safety warnings, and other relevant information.

However, humanitarian information is often mixed with irrelevant or non-humanitarian content, making manual analysis difficult at scale.

RESQAI addresses this problem using a hybrid AI architecture combining a fine-tuned **BERTweet** classifier with **Gemini** for secondary contextual analysis of uncertain or potentially misleading predictions.

---

## Team APEX

| Team Member | Roll Number |
|---|---|
| Dhwani Agarwal | 1024031024 |
| Sanchita Jain | 1024031020 |
| Yuvakshi Sood | 1024031025 |

**Department:** Computer Science  
**Institute:** Thapar Institute of Engineering and Technology

---

# Problem Statement

Disaster-related social media messages are highly diverse and unstructured. A single disaster event can generate thousands of messages containing different types of humanitarian information.

Examples include:

- Requests for food, water, medical assistance, or rescue
- Reports of injured or deceased people
- Missing-person information
- Evacuation and displacement information
- Infrastructure and utility damage
- Safety warnings and advice
- Rescue, volunteering, and donation efforts
- General disaster-related information
- Irrelevant or non-humanitarian content

Manually identifying and categorizing these messages is time-consuming and difficult during rapidly developing emergencies.

RESQAI aims to automate this initial classification process and provide additional contextual information for messages that require deeper analysis.

---

# Proposed Solution

RESQAI uses a two-stage AI architecture.

### Stage 1 — BERTweet

A fine-tuned **BERTweet** model performs the primary classification of incoming disaster-related messages.

BERTweet was selected because it is pretrained specifically on Twitter-style text and is therefore well suited to social-media language, including short messages, hashtags, informal spelling, and other characteristics commonly found in disaster-related posts.

### Stage 2 — Gemini

Gemini acts as a secondary contextual analysis layer.

It is selectively invoked when:

1. BERTweet has low prediction confidence, or
2. BERTweet predicts `not_humanitarian`, which is treated as a potentially risky classification requiring additional contextual verification.

Gemini does not replace the trained classifier. Instead, it provides additional contextual reasoning and extracts information such as urgency, location, and whether a request for assistance is present.

---

# System Architecture

```text
                    Incoming Message
                           |
                           v
                    BERTweet Model
                           |
                    Prediction +
                     Confidence
                           |
              +------------+------------+
              |                         |
        High Confidence          Low Confidence
              |                         |
              |                         v
              |                    Gemini API
              |                         |
              |                  Contextual Analysis
              |                         |
              +------------+------------+
                           |
                           v
                    Final Result
                           |
          +----------------+----------------+
          |                |                |
       Category         Urgency          Location
                         |
                  Request for Help
