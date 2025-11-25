/**
 * SPDX-License-Identifier: MIT
 */

import {
  cancel,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  select,
  spinner,
  text
} from '@clack/prompts';
import { ProjectSetupMCP } from '@repo/project-setup-mcp';
import type { InterviewQuestion } from '@repo/project-setup-mcp';

const promptForQuestion = async (
  question: InterviewQuestion
): Promise<string | string[]> => {
  if (question.type === 'text') {
    const value = await text({
      message: question.prompt,
      placeholder: question.placeholder
    });

    if (isCancel(value)) {
      cancel('Project setup cancelled.');
      process.exit(0);
    }

    return String(value);
  }

  if (question.type === 'single_choice') {
    const value = await select({
      message: question.prompt,
      options:
        question.options?.map((option) => ({
          value: option.value,
          label: option.label
        })) ?? []
    });

    if (isCancel(value)) {
      cancel('Project setup cancelled.');
      process.exit(0);
    }

    return String(value);
  }

  const value = await multiselect({
    message: question.prompt,
    options:
      question.options?.map((option) => ({
        value: option.value,
        label: option.label
      })) ?? []
  });

  if (isCancel(value)) {
    cancel('Project setup cancelled.');
    process.exit(0);
  }

  return value.map((v) => String(v));
};

export const projectSetup = async () => {
  try {
    intro('Zopio project setup');

    const rootDir = process.cwd();
    const mcp = new ProjectSetupMCP({ rootDir });

    const session = mcp.startSession();

    log.info('Starting interactive interview to profile your project.');

    // Interview loop
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, question } = mcp.getNextQuestion(session.id);

      if (done || !question) {
        break;
      }

      const answer = await promptForQuestion(question);
      mcp.submitAnswer(session.id, question.id, answer);
    }

    const profile = mcp.getProjectProfile(session.id);

    log.info('Derived project profile:');
    log.message(`- Name: ${profile.attributes?.projectName}`);
    log.message(`- Apps: ${(profile.attributes?.apps ?? []).join(', ')}`);
    log.message(
      `- Architecture: ${profile.attributes?.architecture ?? 'unknown'}`
    );

    const s = spinner();
    s.start('Generating setup plan...');
    const plan = mcp.generateSetupPlan(session.id);
    s.stop('Setup plan generated.');

    const changes = plan.attributes?.fileChanges ?? [];

    log.info('Planned changes:');
    for (const change of changes.slice(0, 10)) {
      log.message(`- ${change.path} [${change.operation}]`);
    }
    if (changes.length > 10) {
      log.message(`- ...and ${changes.length - 10} more changes`);
    }

    const confirmValue = await select({
      message: 'Apply this setup plan to your local repo?',
      options: [
        { value: 'yes', label: 'Yes, apply the plan' },
        { value: 'no', label: 'No, cancel without changes' }
      ]
    });

    if (isCancel(confirmValue) || confirmValue === 'no') {
      cancel(
        'Project setup plan not applied. You can re-run `zopio project:setup` later.'
      );
      process.exit(0);
    }

    s.start('Applying setup plan...');
    const changeset = await mcp.applySetupPlan(plan.id);
    s.stop('Setup plan applied.');

    const applied = changeset.attributes?.fileChanges ?? [];
    const created = applied.filter((c) => c.changeType === 'created').length;
    const updated = applied.filter((c) => c.changeType === 'updated').length;
    const unchanged = applied.filter(
      (c) => c.changeType === 'unchanged'
    ).length;
    const skipped = applied.filter((c) => c.changeType === 'skipped').length;

    log.info('Applied changes summary:');
    log.message(`- created:   ${created}`);
    log.message(`- updated:   ${updated}`);
    log.message(`- unchanged: ${unchanged}`);
    log.message(`- skipped:   ${skipped}`);

    outro('Project setup completed.');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Project setup failed: ${String(error)}`;
    log.error(message);
    process.exit(1);
  }
};

