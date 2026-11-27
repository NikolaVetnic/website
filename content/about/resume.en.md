---
title: Resume
language: English
flag: gb
pdf: https://drive.google.com/file/d/1j5cYU8j2asyD9l2LVOWH-j3TYfSVDewc/view?usp=sharing
---

Backend-focused software developer with strong experience in .NET, cloud infrastructure (Azure) and DevOps, currently building AI agent governance and LLM gateway infrastructure, with a background in game development and computer graphics.

Known for building robust, maintainable systems and for working across technical and creative fields.

## EXPERIENCE

### **AI Engineer** at Brighting, Netherlands : Oct 2026 – Present

- Developing _Agentic Runway_, an AI agent governance platform (agent registry, LLM gateway, MCP tool gateway), and delivered its first private-network Azure installation, for a Dutch window decoration company.
- Built the customer delivery and deployment pipeline, a lower-cost MCP gateway in place of Azure API Management, and OAuth access-token authentication for the LLM gateway, so that model spend is billed to a verified identity.  
  _Tech:_ TypeScript, Node.js, Python, Terraform, Azure (Container Apps, Key Vault, Entra ID), AWS, Envoy, LiteLLM, PostgreSQL, Okta, Docker, GitHub Actions

### **Lead Software Developer** at Rationale Technologies, Serbia : Oct 2025 – Sep 2026

- Led and implemented a decision support platform for procurement and tender approvals for a national oil company in the United Arab Emirates, with approval workflows driven by the Delegation of Authority and each tender's parameters.
- Worked on systems integration, Azure operations and architecture: connected enterprise systems to external services, designed the deployment and release processes, and managed the cloud resources.  
  _Tech:_ .NET 8, ASP.NET Core, EF Core, SQL Server, Azure, Angular

### **Software Developer** at j&s-soft AG, Germany (remote) : Sep 2022 – Oct 2025

- Developed the storage component of [Mein Bildungsraum](https://www.meinbildungsraum.de/), a project of the German Ministry of Education (later SPRIN-D), for secure data and certificate transfer in the [Enmeshed](https://enmeshed.eu/) ecosystem.  
  _Tech:_ .NET 8, ASP.NET Core, EF Core, MediatR, RabbitMQ, OpenIddict, PostgreSQL, SpecFlow, xUnit.net, Docker, GitHub Actions  
  _GitHub:_ [nmshd/backbone](https://github.com/nmshd/backbone)
- Built a prototype of credential issuer and verifier services to the [OID4VCI](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) and [OID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) specifications, showing that they fit the Enmeshed architecture.  
  _Tech:_ Node.js, Express, TypeScript, Docker  
  _GitHub:_ [NikolaVetnic/OID4VCI-VP_Prototype](https://github.com/NikolaVetnic/OID4VCI-VP_Prototype)
- As lead developer and architect, designed and built _Timelines_, software that fits office workers' daily workflow whatever their level of IT skill (Dec 2024 – Oct 2025).  
  _Tech:_ .NET 9, ASP.NET Core, EF Core, MediatR, PostgreSQL, SpecFlow, React, Docker, GitHub Actions

## OPEN SOURCE

- **OpenMW**, the open-source C++ game engine and editor: three merged contributions (Nov 2026).
  - Engine: recovers from a damaged navigation mesh cache instead of crashing, and tells users how to fix SQLite database failures ([merge request 5762](https://gitlab.com/OpenMW/openmw/-/merge_requests/5762)).
  - Editor (C++, Qt): one shared widget in place of three diverging copies of the toolbar's right-click lists, so they all behave the same; also fixed a crash when selecting a deleted texture ([merge request 5738](https://gitlab.com/OpenMW/openmw/-/merge_requests/5738)).
  - Documentation: the project's code style guide, in place of outdated wiki pages, with rules drawn from the clang-format and clang-tidy configuration and the existing code; the open conventions settled with the maintainers over two review rounds ([merge request 5725](https://gitlab.com/OpenMW/openmw/-/merge_requests/5725)).
- **Testcontainers for .NET**, the library that runs throwaway Docker containers for tests: two merged contributions (Oct–Nov 2026).
  - New module (C#, Docker, gRPC): the Google Cloud Spanner emulator, in line with the existing modules and the Java implementation; exposes the gRPC and REST endpoints and waits until the emulator is ready, with integration tests and a documentation page ([pull request 1832](https://github.com/testcontainers/testcontainers-dotnet/pull/1832)).
  - Database modules: an `ExecScriptAsync` overload that takes a custom text encoding, in 13 modules; found and fixed SQL Server's `sqlcmd` ignoring the encoding, with tests that fail without the fix ([pull request 1805](https://github.com/testcontainers/testcontainers-dotnet/pull/1805)).

All contributions, as the list grows: the [Open source](/projects/open-source) tab in Projects.

## PERSONAL PROJECTS

### **Independent game development** : 2017 – Present

- Solo developer: code, design, art, audio and music.
- [K'NOSSOS](/games/knossos): a surreal point-and-click sci-fi adventure, crowdfunded on Kickstarter (373 backers, 2017), in active development.  
  _Tech:_ C#, Unity
- [SODHARA](/games/sodhara): a retro 2D sci-fi action platformer focused on exploration.  
  _Tech:_ C#, Unity

### **Ray tracing algorithms for voxel objects** : May 2021 – Jul 2021

- Optimized ray tracing algorithms for voxel-based 3D objects; the work became the subject of the master's thesis (2025).  
  _Tech:_ Java, JavaFX  
  _GitHub:_ [NikolaVetnic/RG2_GI](https://github.com/NikolaVetnic/RG2_GI)

## OTHER EXPERIENCE

### **Professor of Vocational Studies** at the Preschool Teachers Training College : Feb 2013 – Sep 2022

- Taught and examined bachelor's and master's students in music subjects, and coordinated Erasmus exchange programmes with EU institutions.
- Also Assistant Director and Head of the International Office.

## SKILLS

- **Programming languages:** C#, TypeScript, JavaScript, Python, Java, C++, SQL, Bash
- **Backend:** .NET 7–9, ASP.NET Core, Entity Framework Core, Node.js, Express, Spring, Hibernate, SAP CAP
- **Frontend and UI:** React, Redux, Remix, Angular, Qt, JavaFX
- **Testing:** xUnit.net, SpecFlow, FluentAssertions, ArchUnitNET, JUnit, Jest
- **Cloud and DevOps:** Azure, AWS, Docker, Kubernetes, Helm, Terraform, GitHub Actions, GitLab CI/CD
- **Data and messaging:** PostgreSQL, SQL Server, RabbitMQ
- **Architecture:** Clean Architecture, Domain-Driven Design, event-driven architecture, microservices, modular monolith, TDD

## LANGUAGES

Serbian (native); English, Russian and Norwegian (fluent); German (intermediate).

## EDUCATION

### **M.Sc. in Information Technology** at the Faculty of Sciences, Novi Sad : Sep 2025

- Grade point average 10.0 / 10.0

### **B.Sc. in Information Technology** at the Faculty of Sciences, Novi Sad : Jun 2023

- Grade point average 10.0 / 10.0

### **Doctor of Arts in Composition** at the Faculty of Music, Belgrade : Mar 2017

- Grade point average 9.77 / 10.0

### **M.A. in Composition** at the Academy of Arts, Novi Sad : Jun 2012

- Grade point average 10.0 / 10.0

### **B.A. (Hons) in Composition** at the Academy of Arts, Novi Sad : Jun 2011

- Grade point average 9.05 / 10.0

### Certificates

- SAP Certified Development Associate: ABAP with SAP NetWeaver 7.50 (Jan 2023)
- Java Junior Course, BRAINS Academy of the Vojvodina ICT Cluster (Oct 2021)
