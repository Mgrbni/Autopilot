# Task state machine

Allowed transitions:

- `Inbox -> ClarifyingNeeded` if blockers exist.
- `Inbox -> Researching` if blockers are minimal and research is needed.
- `ClarifyingNeeded -> Researching` after user clarification.
- `Researching -> ReadyToSchedule` after research approval.
- `ReadyToSchedule -> Scheduled` only after plan approval.
- `Scheduled -> InProgress` when user logs action.
- `InProgress -> Blocked` when external/document blocker appears.
- `Blocked -> ReadyToSchedule` when blocker resolves.
- Any active state -> `Done` or `Cancelled`.
