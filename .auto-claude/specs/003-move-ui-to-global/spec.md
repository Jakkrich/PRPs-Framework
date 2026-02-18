# Task: Move .auto-claude-ui to Global AppData

- **Reference ID**: PRPS-002
- **Type**: REFACTOR
- **Priority**: P1
- **Status**: DONE

## Description
Move the local `.auto-claude-ui` folder from the project root to the global AppData directory (`%APPDATA%\auto-claude-ui`). This is necessary because the local folder contains many files, making the main project heavy and slowing down operations.

## implementation Plan
1.  **Backup**: Ensure existing global data (if any) is safe.
2.  **Move**: Move the content of `e:\PRPs-Framework\.auto-claude-ui` to `C:\Users\User\AppData\Roaming\auto-claude-ui`.
3.  **Cleanup**: Remove the local folder.
4.  **Configuration**: Verify that the application picks up the global configuration.
5.  **Gitignore**: Add `.auto-claude-ui` to `.gitignore` to prevent future accidental creation/tracking.

## Notes
- The user reported the project is heavy due to these files.
- The global location should be used "like before".
