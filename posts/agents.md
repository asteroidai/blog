---
title: 'Evaluating Generalist Agents'
date: '2024-11-11T00:07:44.675Z'
description: 'Testing generalist agents is hard, and we need evaluation techniques that can keep up with them.'
thumbnail: '/img/blog/abstract.jpg'
---

# You Also Need Supervision

AI-based software represents an entirely new category of software engineering, and brings with it an extensive list of unsolved problems:

- What sort of decisions should your software make on your behalf?
- What does it mean for your system to self-improve at runtime?
- How do you evaluate success rates of increasingly general purpose software systems?

We need new ways of thinking about our software in order to move forward, but we have good reasons to believe that the upside of getting it right is astronomical. 

Today, every company deploying agents goes through the same life cycle:

1. *Build a prototype*
2. *Vibe-check*
3. *Deployment*
4. *Agent makes a mistake (customer complains)*
5. *Fix/Improve agent → Goes to 2 (Repeat unsustainably)*

It is only after many iterations of this cycle that developers realize that perfect agents can’t exist. The more freedom to make decisions and affect the world they have, the more opportunities there are to make mistakes; *intelligent systems are necessarily imperfect.*

### What’s wrong with offline evaluations?

At this point, many try to write offline evaluations and basic model input/output guardrails. Offline evaluations are necessary, and we use these in many other settings for traditional machine learning models, like computer vision systems for ID verification. In theory, we can use the results to iteratively improve the agent by modifying its scaffolding, prompts and by fine-tuning the underlying model. If, when we’re finished, our offline tests map well to the scenarios that the agent will face at runtime, then we should have some kind of idea of how the agent will perform in the wild. 

One key problem with evaluating agents in this way is that the action space is much larger. The space of possible actions when evaluating whether an ID is valid or not is quite small (accept or reject) and building a test set is quite easy (gather photos of ID cards). In the case of an agent that has a much wider range of actions (e.g. dozens of possible tool calls that it can choose between at will, or the ability to execute code), the action space is much larger, and building tests sets to evaluate the agent on is extremely difficult. 

So if offline testing is insufficient to understand the runtime behavior of agentic systems, what’s the solution?

### Runtime evals via supervision
We believe that to make agents work, we’re going to need entirely new evaluation methods,  interfaces, and oversight mechanisms. To deploy reliable, safe and continuously improving agents we’ll need:

1. Offline evaluations that you can rapidly build and destroy at will, allowing tight development loops
2. Runtime agent supervision that is scalable to millions of agent actions 
3. Seamless human-agent interaction

As there aren’t good existing solutions for this, we are building the solution. In the following we'll outline the necessary components of the overall supervision and evaluation system of AI Agents that we're planning to build.

1. **Offline Evaluations**
    Agent must be tested before real-world deployment on evaluation examples, past executions and new simulations. Any non-deterministic component and downstream components  should be evaluated before deployment. It has to be possible to run extremely fast iterative offline experimentation.
    
    1. Real-time Observability and Monitoring
    2. Toggle non-determinism for debugging
    3. Evals (tasks, examples, scoring functions)
    4. Simulation

2. **Online Supervision**
    Offline evaluations can’t rule out unintended behaviour at runtime. Supervision at runtime is crucial to enforce defined rules and policies. Every agent action with significant impact should have associated supervisors.
    
    1. **Policy Enforcement** 
        Supervisors need to be able to actively change agents behaviour to prevent or correct bad actions.
        
    2. **Highly Configurable Supervisors**
        Each agent action requires specific type of supervision. Customers can create different supervisor chains depending on the action (e.g. sending emails, updating database, command execution)
        
    3. **Supervisor Hierarchy**
        Supervision is hierarchical. Similar to actions in real-life where for more high impact actions, more . This is more prevalent with ai agents where some form of supervision might be faster and cheaper. The common pattern we expect to emerge will be deterministic supervisor escalating to AI-based supervisor escalating to human supervisor.
        
    4. **Supervisors Independence**
        Supervisors operate independently from their monitored AI agents. They have separate instruction sets and data access permissions.
        
3. **Human in the Loop**
    Many actions will still require human approval. We expect that soon 1 person could efficiently oversee 10,000+ agents with only specific actions needing approval. To make approval extremely fast and intuitive, there need to be configurable UIs for agent types and human roles.
    
    1. **Human feedback and correction**
    2. **Deep Observability (context-aware)**
        To effectively supervise agentic system and make a decision in real-time, granular observation into agent’s execution is needed. 
        
    3. **Context-specific**
        We need to present relevant context to the human operator (e.g. summary of last messages, risk scores for each action). AI should actively find relevant information to surface to the human.
        
    4. **Agent-specific views**
        UIs need to be tailored to each agent. Different agents require different UIs (e.g. screenshots for web-browsing agent).
        
4. **Easy to Integrate**
    1. **Python package**
        1. OpenAI, LangChain, Inspect AI 
        2. Anthropic, LangGraph, and others

5. **Scalable**
    The supervision needs to scale with growing agent capabilities and number of agents.

6. **Self-improving Supervision and Agent design**
    1. Every agent execution, every interaction with a customer, every supervisor correction should improves the future agent executions.
    2. Execution logs reusability when the agent scaffold changes
    3. CI/CD evaluations to automatically detect regressions.

## Releasing Sentinel

To address the above challenges, we are launching the closed beta for [Sentinel](https://docs.entropy-labs.ai/), a powerful new way to improve agent reliability and safety.

Sentinel makes it much easier to rapidly prototype, evaluate and monitor agents in the wild. In just a few lines of code, you can add *Supervisors* to your agent which can catch unintended behaviors and edge cases. 

Sentinel is *not* an agent framework. It can hook into any agent of your choice and instantly give you runtime safety and reliability guarantees. 

Sentinel is comprised of a Python package and a user interface that you can install and run locally using Docker. The UI gives you deep insights into agent actions, tools that the agent is using, and how supervisors have responded to requests by your agent to execute those tools. 

The UI allows human operators to manually approve, reject or modify agent tool requests. A common design pattern is to have automated supervisors run first and only escalate to human when problematic behavior is detected. 

The main functionalities that Sentinel provides: 
1. Customizable supervisors for any tool call
2. Human in the Loop
3. Tool stubbing for deterministic testing of agents 

# Supervisors

A Supervisor is a function that returns a decision when given some information about the agent and its desired action. 

Developers can use our Python decorator to attach a list of supervisors to any function that that is available to your LLM. 

### How do Supervisors work?

When your agent decides to call a function, before the function call is executed, the supervisors attached to the function will check whether the execution can proceed and return a decision which determines what happens next:

- `approved:` the tool is executed
- `reject`: the tool is not executed the agent must retry
- `escalate`: the decision is deferred to the next Supervisor in the chain
- `modify`: the action is accepted, with modifications

Supervisors enable us to catch unintended agent behaviors at runtime, and very often allow the agent to correct it’s own actions. Supervisors are very simple, and highly configurable, making them a very powerful tool for quickly enforcing policies and behaviors onto an LLM-based system. 

### Out-of-the-box Supervisors

We provide a wide range of supervisors out-out-the-box, so you can get started supervising your agents immediately. 

### Configuring a new Supervisor for your use case

The configuration of a custom LLM Supervisor for example, could be as simple as passing a company policy document to an LLM and asking it whether the current agent’s trajectory is inline with the policy. The LLM can then return either approve, reject, modify, escalate or terminate to the agent. Supervisors implementation is extremely flexible. It can include another AI models or deterministic supervisors such as regex rules. We provide some common supervisors that can be configured out of the box, e.g. LLM supervisor, Bash commands supervisors, Python code execution supervisor. But Sentinel users can bring their own specialized supervisors tailored to the agent and provided tool calls. 

### Chaining Supervisors together

Supervisors can be chained together and run in parallel. For example fast deterministic supervisor can escalate to AI-based supervisor that can escalate to human. Developers can create multiple supervisor chains that can run in parallel, each checking for specific behavior.

# Human in the Loop

Some agent actions might need human approval. For this, we provide a Human in the Loop Supervisor that works with our UI, giving you immediate human control. 

### High-risk scenario

The most basic usage of our Human in the Loop Supervisor is to add it directly to a tool with no other Supervisors. In this case, every execution of this tool will need human approval. 

More sophisticated usage is to have human to only step in when multiple automated supervisors did not pass.

Human is presented in the web UI with all context needed to make a decision. This includes previous messages, tool calls, current tool call and arguments, previous supervisors that escalated etc. Human can approve, reject or modify the tool call to steer the agent on a correct trajectory.

# Mocking

When testing LLM application, it’s useful to be able to test the . Since our `supervise()` decorator wraps around the tool calls, it can also be used to stub the tool calls. This is useful when the tool call can have impact on your system (such as changing data in a database or writing files to disk)

# Find out More

Go to our [Documentation](https://docs.entropy-labs.ai/) for more detailed explanations and examples. You can learn more about how our supervisors work, how our human in the loop UI looks like and get [instructions](https://www.notion.so/Blog-Ideas-9d1e5b516b99474c80db226b64f71829?pvs=21) on how to start using Sentinel. Check out one of our [examples](...) for a customer support agent that uses our AI supervisors with human-in-the loop escalation for high risk-actions.

If you'd like to deploy agents quickly, reliably and safely with Sentinel, [book a demo](https://calendly.com/david-mlcoch-entropy-labs/entropy-labs-demo) with us.
