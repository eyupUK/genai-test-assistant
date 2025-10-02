US-LOGIN-002 — Locked account is blocked with clear message

As a locked-out user
I want to be clearly informed that my account is locked
So that I understand why I cannot sign in

Acceptance Criteria (maps to: Invalid login shows an error / example: locked_out_user):

Given I am on the SauceDemo login page

When I attempt to log in with a locked account (locked_out_user / secret_sauce)

Then I remain on the login page

And I see the exact error: “Epic sadface: Sorry, this user has been locked out.”