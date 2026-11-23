---
title: OID4VCI / OID4VP prototype
summary: Issuing and presenting a verifiable university diploma to the OpenID specifications, with selective disclosure and proof of possession.
years: 2024
status: finished
tech: [TypeScript, Node.js, Express, Docker]
repo: https://github.com/NikolaVetnic/OID4VCI-VP_Prototype
---

A working prototype of issuing and presenting verifiable credentials to the [OpenID for Verifiable Credential Issuance](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) (OID4VCI) and [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) (OID4VP) specifications, with a university diploma as the example. Built at j&s-soft, to show that the two fit the architecture of the [Enmeshed](https://enmeshed.eu/) ecosystem.

## The problem

A graduate (the holder) wants to prove to an employer (the verifier) that they hold a diploma signed by a university (the issuer). Three things make that hard:

- The employer has to trust the diploma without asking the university.
- The graduate should be able to show part of it and hide the rest: the degree, but not the grade. This is selective disclosure.
- The graduate has to prove that the diploma is theirs, not copied from someone else's wallet: proof of possession.

OID4VCI covers getting the credential into the wallet; OID4VP covers presenting it.

## What it does

- Credentials are SD-JWTs: the hidden claims are digests, readable only from the disclosures the holder chooses to send.
- Issuance needs a single-use proof signed with the holder's own key.
- A presentation is bound both to the holder and to the request that asked for it.
- The verifier finds the issuer's key through a certificate chain that it follows back to a trusted root.

Nothing in it is simulated, but it is a prototype, not production code: what it leaves out is the governance and operations around all this, which the repository describes.
