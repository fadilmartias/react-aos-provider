# Contributing

Thanks for taking the time to contribute!

## Setup

```bash
git clone https://github.com/fadilmartias/react-aos-provider.git
cd react-aos-provider
npm install
```

## Workflow

1. Create a branch off `main`.
2. Make your change.
3. Run the checks locally before opening a PR:
    ```bash
    npm run typecheck
    npm run lint
    npm run test
    npm run build
    ```
4. Add a changeset describing your change:
    ```bash
    npm run changeset
    ```
5. Open a pull request.

## Commit style

Keep commits focused and descriptive. There's no strict convention enforced, but clear messages help changelog generation and code review.

## Reporting bugs

Please open an issue with a minimal reproduction (a CodeSandbox/StackBlitz link is ideal) and the steps to reproduce.
