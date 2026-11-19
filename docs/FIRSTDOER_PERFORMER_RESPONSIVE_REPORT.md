# FIRSTDOER — PERFORMER RESPONSIVE REPORT

> **Viewports Tested:** `1920x1080`, `1440x900`, `768x1024`, `375x812` (`TASKER` role in Frontend Test Mode).

| Route | 1920x1080 | 1440x900 | 768x1024 | 375x812 | Defects |
|---|---|---|---|---|---|
| `/performer/dashboard` | PASS | PASS | PASS | PASS | `hShift = 0` |
| `/performer/find-tasks` | PASS | PASS | PASS | PASS | `hShift = 0`; filter pills scroll horizontally at `375px` |
| `/performer/my-tasks` | PASS | PASS | PASS | PASS | `hShift = 0` |
| `/performer/active-task/task-102` | PASS | PASS | **FAIL** | **FAIL** | `768x1024`: `Open Chat` clipped (`x:654, right:787`); `375x812`: tab strip overflows; `TestModeBadge` covers sticky CTA |
| `/performer/account` | PASS | PASS | PASS | **FAIL (Visual)** | Decorative black circles overlap profile text at `375x812` |
| `/performer/earnings` | PASS | PASS | PASS | PASS | `hShift = 0` |
| `/performer/profile` | PASS | PASS | PASS | PASS | `hShift = 0` |
| `/performer/chats` | PASS | PASS | PASS | **FAIL** | Opening thread at `375x812` overflows horizontally (`composer x:313..704`) |
