/**
 * SPDX-License-Identifier: MIT
 */

import { join } from 'node:path';
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import {
  createProjectSetupServer,
  QuestionType,
  type InterviewQuestion,
  type AnswerSubmission,
} from '@repo/project-setup-mcp';

/**
 * Render a question and collect user input
 */
async function askQuestion(
  question: InterviewQuestion
): Promise<AnswerSubmission['value'] | symbol> {
  switch (question.type) {
    case QuestionType.TEXT: {
      const result = await text({
        message: question.prompt,
        placeholder: question.placeholder,
        initialValue:
          typeof question.defaultValue === 'string'
            ? question.defaultValue
            : undefined,
        validate(value: string) {
          if (question.required && value.trim() === '') {
            return 'This field is required';
          }
          if (question.validationPattern) {
            const regex = new RegExp(question.validationPattern);
            if (value && !regex.test(value)) {
              return question.validationMessage || 'Invalid format';
            }
          }
          return undefined;
        },
      });
      return result;
    }

    case QuestionType.SELECT: {
      if (!question.options) {
        throw new Error('Select question missing options');
      }
      const result = await select({
        message: question.prompt,
        options: question.options.map((opt: { value: string; label: string; description?: string }) => ({
          value: opt.value,
          label: opt.label,
          hint: opt.description,
        })),
        initialValue:
          typeof question.defaultValue === 'string'
            ? question.defaultValue
            : undefined,
      });
      return result;
    }

    case QuestionType.MULTI_SELECT: {
      if (!question.options) {
        throw new Error('Multi-select question missing options');
      }
      const result = await multiselect({
        message: question.prompt,
        options: question.options.map((opt: { value: string; label: string; description?: string }) => ({
          value: opt.value,
          label: opt.label,
          hint: opt.description,
        })),
        initialValues: Array.isArray(question.defaultValue)
          ? question.defaultValue
          : [],
        required: question.required,
      });
      return result;
    }

    case QuestionType.CONFIRM: {
      const result = await confirm({
        message: question.prompt,
        initialValue:
          typeof question.defaultValue === 'boolean'
            ? question.defaultValue
            : true,
      });
      return result;
    }

    default:
      throw new Error(`Unknown question type: ${question.type}`);
  }
}

/**
 * Display plan summary and ask for confirmation
 */
async function confirmPlan(summary: string): Promise<boolean | symbol> {
  log.info('Setup Plan Summary:');
  console.log('');
  console.log(summary);
  console.log('');

  return confirm({
    message: 'Apply this setup plan?',
    initialValue: true,
  });
}

/**
 * Main project setup flow
 */
export async function projectSetup(options: { dryRun?: boolean }): Promise<void> {
  try {
    intro("Let's set up your Zopio project!");

    const server = createProjectSetupServer();
    const rootDir = process.cwd();

    // Start a new session
    const { session, firstQuestion } = server.startSession();
    log.info(`Session started (${session.id.substring(0, 8)}...)`);

    // Run the interview
    let currentQuestion: InterviewQuestion | undefined = firstQuestion;
    let stepNumber = 1;

    while (currentQuestion) {
      // Show help text if available
      if (currentQuestion.helpText) {
        log.message(currentQuestion.helpText);
      }

      // Ask the question
      const answer = await askQuestion(currentQuestion);

      // Handle cancellation
      if (isCancel(answer)) {
        cancel('Setup cancelled.');
        server.deleteSession(session.id);
        process.exit(0);
      }

      // Submit the answer to the MCP
      const result = server.submitAnswer(session.id, {
        questionId: currentQuestion.id,
        value: answer,
      });

      if (!result.accepted) {
        log.error(result.errorMessage || 'Invalid answer');
        continue; // Re-ask the same question
      }

      stepNumber++;
      currentQuestion = result.nextQuestion;
    }

    log.success('Interview complete!');

    // Generate the plan
    const s = spinner();
    s.start('Generating setup plan...');

    const planResult = server.generatePlan(session.id);

    s.stop('Plan generated!');

    // Show plan summary and ask for confirmation
    const shouldApply = await confirmPlan(planResult.summary);

    if (isCancel(shouldApply) || !shouldApply) {
      cancel('Setup cancelled. Plan was not applied.');
      server.deleteSession(session.id);
      process.exit(0);
    }

    // Apply the plan
    s.start('Applying setup plan...');

    const applyResult = server.applyPlan(session.id, {
      rootDir,
      dryRun: options.dryRun,
      forceOverwrite: false,
    });

    s.stop('Setup complete!');

    // Show changeset summary
    log.info('Changeset Summary:');
    console.log('');
    console.log(applyResult.summary);
    console.log('');

    // Show next steps
    const nextSteps = [
      'Configure environment variables in each app\'s .env.local file',
      'Run `pnpm migrate` to set up the database schema',
      'Review and customize the generated wiring code',
      'Start development with `pnpm dev`',
    ];

    log.info('Next steps:');
    for (const [index, step] of nextSteps.entries()) {
      log.message(`${index + 1}. ${step}`);
    }

    outro('Your project is ready! 🚀');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Failed to set up project: ${error}`;

    log.error(message);
    process.exit(1);
  }
}
