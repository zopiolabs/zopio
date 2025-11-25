/**
 * SPDX-License-Identifier: MIT
 */

import { ProjectSetupServer } from '@repo/project-setup-mcp';
import * as p from '@clack/prompts';

export async function projectSetup() {
  p.intro('Zopio Project Setup');

  const server = new ProjectSetupServer();
  const session = server.startSession();

  try {
    let currentQ = server.getNextQuestion(session.id);

    while (currentQ) {
      let answer: any;

      if (currentQ.type === 'text') {
        answer = await p.text({
          message: currentQ.text,
          placeholder: currentQ.description,
          validate: (val) => {
            if (currentQ!.required && !val) return 'Required';
          }
        });
      } else if (currentQ.type === 'select') {
        answer = await p.select({
          message: currentQ.text,
          options: currentQ.options as any,
        });
      } else if (currentQ.type === 'multi_select') {
        answer = await p.multiselect({
          message: currentQ.text,
          options: currentQ.options as any,
          required: currentQ.required
        });
      } else if (currentQ.type === 'confirm') {
          answer = await p.confirm({
              message: currentQ.text
          });
      }

      if (p.isCancel(answer)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      server.submitAnswer(session.id, answer);
      currentQ = server.getNextQuestion(session.id);
    }

    const spinner = p.spinner();
    spinner.start('Generating setup plan...');
    const plan = server.generatePlan(session.id);
    spinner.stop('Plan generated.');

    p.note(
        [
            `Files to be created/modified: ${plan.targetFiles.length}`,
            ...plan.targetFiles.map(f => `  - ${f}`),
            '',
            `Service Wiring:`,
            ...plan.serviceWiring.map(s => `  - ${s.service}: ${s.status} (${s.notes})`)
        ].join('\n'),
        'Setup Plan Preview'
    );

    const shouldContinue = await p.confirm({
      message: 'Do you want to apply this plan?',
    });

    if (!shouldContinue || p.isCancel(shouldContinue)) {
      p.cancel('Setup cancelled.');
      process.exit(0);
    }

    spinner.start('Applying changes...');
    const changeset = await server.applyPlan(session.id, process.cwd());
    spinner.stop('Changes applied.');

    p.outro(`Project setup complete! Setup ID: ${session.id}`);

    if (changeset.notes.length > 0) {
        console.log('Notes/Warnings:');
        changeset.notes.forEach(n => console.warn(`- ${n}`));
    }

  } catch (error: any) {
    p.cancel(`Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}
