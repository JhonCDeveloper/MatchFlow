Fase 2
-------------------------------------------------------------------------------------------------------------------------------------
# Crudzaso · MatchFlow

Part 2 – Inherited System & Monetization

## Context

After the first delivery of **MatchFlow**, Crudzaso has decided to move the product to its next phase.

At this stage, the focus is no longer only on building core functionality, but on:

* working with **inherited code**,
* stabilizing an existing system,
* extending business rules,
* and introducing **monetization through plans and licenses**.

Each team will receive the source code developed by **another team** during Part 1.
This code must be treated as a real inherited product: it may contain bugs, incomplete features, unclear decisions, or technical debt.

The goal of Part 2 is to **understand, stabilize, extend, and present** the product as if you were a new team taking ownership of a real system at Crudzaso.

---

## Inherited code (no handover)

* Each team will receive only the source code of the assigned project.
* There will be no handover, explanation, walkthrough, or knowledge transfer from the previous team.
* No follow-up questions are allowed to the team that developed Part 1.
* The code must be analyzed, understood, and improved solely based on the received repository and its existing documentation.

---

## General Rules for Part 2

* Teams **must not restart the project from scratch**.
* The inherited code is the baseline and must be respected.
* Refactoring is allowed, but must be justified.
* All decisions must be documented.

---

## Objectives of Part 2

1. Stabilize and complete the core functionality from Part 1.
2. Introduce **subscription plans** for candidates and companies.
3. Extend MatchFlow’s business model to support monetization.
4. Prepare and deliver a **mixed technical and commercial presentation**.

---

## Mandatory Tasks

### 1. Stabilization and Completion (Inherited Code)

Each team must:

* Review the inherited codebase.
* Identify and fix:

  * functional bugs,
  * broken flows,
  * incomplete or partially implemented features.
* Ensure that all **minimum acceptance criteria from Part 1** are fully working.

This includes, but is not limited to:

* Open to Work visibility rules,
* matching flow,
* reservation and blocking logic,
* contact rules (contacted state),
* proper use of json-server.

Any fixes or changes must be documented.

---

## 2. Subscription Plans and Licensing

MatchFlow now introduces **paid plans** for both candidates and companies.

The system must support different plan levels and enforce their business rules.

---

### 2.1 Candidate Plans (User)

By default, a free candidate has limitations when being reserved by companies.

Paid plans unlock additional visibility and flexibility.

Minimum required plans:

#### Free Candidate

* Can be reserved by **only one company at a time**.
* When reserved, other companies:

  * cannot reserve the candidate,
  * may or may not see them (decision inherited from Part 1).

#### Pro Candidate – Level 1

* Can be reserved by **up to 2 companies simultaneously**.
* Reservation count must be enforced by the system.
* If the limit is reached, further reservations must be blocked.

#### Pro Candidate – Level 2

* Can be reserved by **up to 5 companies simultaneously**.
* Reservation limits must be enforced.
* This plan represents maximum exposure for candidates.

Plan enforcement must be handled at the business logic level, not just UI.

---

### 2.2 Company Plans

Companies now pay to increase visibility, reach, and filtering capabilities.

Minimum required plans:

#### Free Company

* Can see candidates only according to the default MatchFlow rules.
* Cannot bypass reservation restrictions.
* Has limited filtering capabilities.

#### Business Company

* Can access enhanced candidate visibility.
* Can apply advanced filters, including:

  * custom skill-based filtering.
* May have increased limits on matches or searches (group decision).

#### Enterprise Company

* Can view **all candidates**, even if they are currently reserved by other companies.
* Can filter candidates freely by skills and other attributes.
* Reservation rules still apply, but visibility is no longer restricted.

The exact UI representation of plans is a group decision, but behavior must be enforced.

---

## 3. Plan Management Requirements

* Plans must be clearly identifiable in the system.
* Each user and company must have exactly one active plan.
* Plan rules must be enforced consistently.
* Payments can be **simulated** (no real payment gateway required).
* Upgrading or downgrading plans must update system behavior immediately.

---

## 4. Presentation Requirement

Each team must prepare a **15-minute presentation**.

### Format

* Mixed **technical and commercial** presentation.
* **All team members must speak**.
* Slides are allowed and recommended.

### Content Guidelines

The presentation must include:

#### Product & Business

* What MatchFlow is and the problem it solves.
* How the match-first model works.
* Why monetization through plans makes sense.
* Explanation of candidate and company plans.

#### Technical

* Overview of the inherited codebase.
* Key fixes and improvements made.
* How plans and restrictions were implemented.
* How business rules are enforced.
* Challenges found in the inherited system and how they were solved.

#### Reflection

* What was difficult about working with inherited code.
* What you would improve with more time.
* Key learnings from this phase.

---

## Documentation Requirements

The repository must include updated documentation explaining:

* Changes made to the inherited system.
* Fixed issues from Part 1.
* Description of all plans and their rules.
* How plan restrictions are enforced.
* Any refactoring or architectural decisions.
* Instructions to run the project.

-------------------------------------------------------------------------------------------------------------
Fase 1
-------------------------------------------------------------------------------------------------------------
# Crudzaso · MatchFlow

Part 2 – Inherited System & Monetization

## Context

After the first delivery of **MatchFlow**, Crudzaso has decided to move the product to its next phase.

At this stage, the focus is no longer only on building core functionality, but on:

* working with **inherited code**,
* stabilizing an existing system,
* extending business rules,
* and introducing **monetization through plans and licenses**.

Each team will receive the source code developed by **another team** during Part 1.
This code must be treated as a real inherited product: it may contain bugs, incomplete features, unclear decisions, or technical debt.

The goal of Part 2 is to **understand, stabilize, extend, and present** the product as if you were a new team taking ownership of a real system at Crudzaso.

---

## Inherited code (no handover)

* Each team will receive only the source code of the assigned project.
* There will be no handover, explanation, walkthrough, or knowledge transfer from the previous team.
* No follow-up questions are allowed to the team that developed Part 1.
* The code must be analyzed, understood, and improved solely based on the received repository and its existing documentation.

---

## General Rules for Part 2

* Teams **must not restart the project from scratch**.
* The inherited code is the baseline and must be respected.
* Refactoring is allowed, but must be justified.
* All decisions must be documented.

---

## Objectives of Part 2

1. Stabilize and complete the core functionality from Part 1.
2. Introduce **subscription plans** for candidates and companies.
3. Extend MatchFlow’s business model to support monetization.
4. Prepare and deliver a **mixed technical and commercial presentation**.

---

## Mandatory Tasks

### 1. Stabilization and Completion (Inherited Code)

Each team must:

* Review the inherited codebase.
* Identify and fix:

  * functional bugs,
  * broken flows,
  * incomplete or partially implemented features.
* Ensure that all **minimum acceptance criteria from Part 1** are fully working.

This includes, but is not limited to:

* Open to Work visibility rules,
* matching flow,
* reservation and blocking logic,
* contact rules (contacted state),
* proper use of json-server.

Any fixes or changes must be documented.

---

## 2. Subscription Plans and Licensing

MatchFlow now introduces **paid plans** for both candidates and companies.

The system must support different plan levels and enforce their business rules.

---

### 2.1 Candidate Plans (User)

By default, a free candidate has limitations when being reserved by companies.

Paid plans unlock additional visibility and flexibility.

Minimum required plans:

#### Free Candidate

* Can be reserved by **only one company at a time**.
* When reserved, other companies:

  * cannot reserve the candidate,
  * may or may not see them (decision inherited from Part 1).

#### Pro Candidate – Level 1

* Can be reserved by **up to 2 companies simultaneously**.
* Reservation count must be enforced by the system.
* If the limit is reached, further reservations must be blocked.

#### Pro Candidate – Level 2

* Can be reserved by **up to 5 companies simultaneously**.
* Reservation limits must be enforced.
* This plan represents maximum exposure for candidates.

Plan enforcement must be handled at the business logic level, not just UI.

---

### 2.2 Company Plans

Companies now pay to increase visibility, reach, and filtering capabilities.

Minimum required plans:

#### Free Company

* Can see candidates only according to the default MatchFlow rules.
* Cannot bypass reservation restrictions.
* Has limited filtering capabilities.

#### Business Company

* Can access enhanced candidate visibility.
* Can apply advanced filters, including:

  * custom skill-based filtering.
* May have increased limits on matches or searches (group decision).

#### Enterprise Company

* Can view **all candidates**, even if they are currently reserved by other companies.
* Can filter candidates freely by skills and other attributes.
* Reservation rules still apply, but visibility is no longer restricted.

The exact UI representation of plans is a group decision, but behavior must be enforced.

---

## 3. Plan Management Requirements

* Plans must be clearly identifiable in the system.
* Each user and company must have exactly one active plan.
* Plan rules must be enforced consistently.
* Payments can be **simulated** (no real payment gateway required).
* Upgrading or downgrading plans must update system behavior immediately.

---

## 4. Presentation Requirement

Each team must prepare a **15-minute presentation**.

### Format

* Mixed **technical and commercial** presentation.
* **All team members must speak**.
* Slides are allowed and recommended.

### Content Guidelines

The presentation must include:

#### Product & Business

* What MatchFlow is and the problem it solves.
* How the match-first model works.
* Why monetization through plans makes sense.
* Explanation of candidate and company plans.

#### Technical

* Overview of the inherited codebase.
* Key fixes and improvements made.
* How plans and restrictions were implemented.
* How business rules are enforced.
* Challenges found in the inherited system and how they were solved.

#### Reflection

* What was difficult about working with inherited code.
* What you would improve with more time.
* Key learnings from this phase.

---

## Documentation Requirements

The repository must include updated documentation explaining:

* Changes made to the inherited system.
* Fixed issues from Part 1.
* Description of all plans and their rules.
* How plan restrictions are enforced.
* Any refactoring or architectural decisions.
* Instructions to run the project.

---
