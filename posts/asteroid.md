---
title: 'Asteroid: Runtime Supervision for LLM-powered applications'
date: '2025-01-04T00:07:44.675Z'
description: 'Asteroid is a runtime supervision platform for LLM-powered applications. It provides intelligent guardrails, human oversight, and continuous evaluations to keep your LLM applications safe and reliable.'
thumbnail: '/img/post2/banner.png'
---

## What is Asteroid?

Asteroid provides **runtime supervision for LLM-powered applications** by combining **intelligent guardrails**, **human oversight**, and **continuous evaluations**. This allows companies to deploy their LLM applications safely and confidently.

We know that making good use of AI in production is extremely hard; what are the failure modes you’re not aware of? how will your system be abused? what vulnerabilities and liabilities are you exposing yourself to? 

The gold standard is to have a human review every action, but this is of course prohibitively expensive and time consuming. This is where Asteroid comes in.

## The Three Components of Asteroid

Let's illustrate Asteroid's architecture using a basic AI Agent loop. In this loop, the user submits information to the LLM, which then produces an action that is passed back to the LLM. The simplest example of this is a chatbot, where the action is simply writing a message.

Asteroid consists of three core components that we can progressively add to our agent loop below to make it safer and reliable. These components are: 

- **Asteroid Guardrails**: Detect specific behaviors that require attention
- **Asteroid Human Review**: Adds human oversight to your LLM applications
- **Asteroid Evaluations**: Automatically improves the guardrails and LLM prompts

These components can be implemented independently or combined to create a robust, self-improving system.

![agent_loop.jpg](/img/post2/loop1.jpg)

### 1. Asteroid Guardrails

**Guardrails are designed to detect specific behaviors that require attention**, including:

- Undesired behavior (e.g., calling incorrect tools, clicking wrong elements)
- High-risk actions (e.g., operations that always require human review)
- Anomalous behavior (e.g., agents stuck in loops)
- Low-confidence responses (e.g., uncertainty about next steps)

We support two main categories of guardrails:

1. **Code-based Guardrails**: Implement simple logical checks (e.g., regex matching)
2. **Model-based Guardrails**: Use LLMs to evaluate outputs against specified policies

Our guardrails can operate in two modes:

- **Monitoring Mode**: Asynchronously detects behavior patterns, allowing developers to review applications after execution
- **Intervention Mode**: Synchronously prevents actions, potentially triggering LLM resampling with guardrail feedback

Guardrails can be chained sequentially or run in parallel. A common pattern is to run lightweight code-based checks first, only escalating to more expensive model-based guardrails when necessary.

![guardrails.jpg](/img/post2/loop2.jpg)

### 2. Asteroid Human Review

Asteroid makes it easy to add human review to your LLM applications. We provide an API and an interface that enable reviewers to efficiently handle any actions flagged for human review by the guardrails. Reviewers could be whoever is responsible for the application, a dedicated team or a an external third party you choose.

**When guardrails detect concerning behavior, they can escalate to a human to review.** Reviewers can then:
- Approve safe actions
- Modify incorrect outputs
- Reject dangerous operations

For example, the following demonstrates a human reviewer modifying an agent's request to book a flight with an updated maximum price, then approving the action:

![human_review.mp4](/img/post2/human_review.mp4)

Common scenarios requiring human review include:

- Email sending, social media posting
- Web UI interactions
- Database modifications

![hitl.jpg](/img/post2/loop3.jpg)

### 3. Asteroid Evaluations

When a guardrail detects specific behavior and a human reviewer corrects it, Asteroid automatically uses this feedback to improve both the guardrails and LLM prompts. This creates a continuous learning loop with a clear goal: maximize safety and reliability while minimizing the need for human intervention.
Each successful execution and correction is stored in our evaluation database, which serves as a foundation for ongoing system improvements. The process works through two key mechanisms:

1. **Evaluation Collection**: The system automatically captures evaluation examples from:
    - Human review decisions
    - Guardrail detections
    - Application interactions
2. **Automatic Optimization**:
    - Creates and refines guardrails based on past interventions
    - Generates new evaluation cases from real-world usage
    - Optimizes prompt templates using successful interactions
    - Improves detection accuracy through continuous learning

This automated feedback loop ensures that every interaction strengthens your application's safety and reliability. Over time, the system becomes increasingly skilled at preventing issues similar to those it has encountered before, leading to fewer required human interventions while maintaining rigorous safety standards.

![evals.jpg](/img/post2/loop4.jpg)

## Putting it all together

Let's put all components together and show how Asteroid supervises LLM calls using a customer refund request example. In this example, when a customer asks for a refund, Asteroid's supervision ensures proper handling through multiple safety checks, human oversight when needed, and continuous learning from each interaction. Our guardrails check conditions like refund amount and customer authentication, while human reviewers can step in to suggest better approaches, such as offering alternative products before processing refunds. The LLM input together with the modified LLM output is then automatically added to the evaluation database which Asteroid uses to continually improve the prompts and guardrails.

![supervision.jpg](/img/post2/loop5.jpg)

### Asteroid SDK Integration

Asteroid's Python SDK seamlessly integrates with major providers like OpenAI and Anthropic. Implementation requires minimal code changes:

```python
# Initialize Asteroid
run_id = asteroid_init()

# Wrap your favourite LLM client
client = asteroid_openai_client(OpenAI(), run_id)

@supervise()
def refund(...):
    # Function implementation

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=[refund]
)
```

This integration allows you to add Asteroid's safety features with just a few lines of code. Your application receives only the final, approved outputs - there's no context window pollution from resampling or review processes. As Asteroid is fully multimodal, we support vision based agents such as web-browsing agents.

## Who Should Use Asteroid?

Asteroid is ideal for companies that:

- Deploy AI agents in high-stakes domains (healthcare, legal, financial services)
- Build browser-based automation requiring enterprise-grade safety
- Need reliable automation for customer-facing processes
- Want to upgrade from traditional RPA to AI-powered automation
- Require human oversight for critical operations

## Partner With Us

If you're deploying LLM applications and need enterprise-grade safety and reliability, we'd love to help. [Contact us to learn how Asteroid can make your LLM deployments safer and more reliable.](https://calendly.com/founders-asteroid-hhaf/30min)

::: button https://calendly.com/founders-asteroid-hhaf/30min
Schedule a Demo
:::
