/**
 * SPDX-License-Identifier: MIT
 */

import { MCPServer } from '@repo/mcp';
import { z } from 'zod';
import { PlanExecutor } from './plan-executor.js';
import { PlanGenerator } from './plan-generator.js';
import { SessionManager } from './session-manager.js';
import type {
  AppliedChangeset,
  Question,
  SetupPlan,
  SetupSession,
} from './types.js';

export class ProjectSetupServer {
  private mcp: MCPServer;
  private sessions: Map<string, SessionManager> = new Map();
  private plans: Map<string, SetupPlan> = new Map();
  private planGenerator: PlanGenerator;
  private planExecutor: PlanExecutor;

  constructor() {
    // Initialize base MCP server for resource storage/retrieval visibility
    this.mcp = new MCPServer({
      name: 'Project Setup MCP',
      resources: {
        session: MCPServer.createResourceDefinition(z.object({}).passthrough()),
        profile: MCPServer.createResourceDefinition(z.object({}).passthrough()),
        plan: MCPServer.createResourceDefinition(z.object({}).passthrough()),
        changeset: MCPServer.createResourceDefinition(
          z.object({}).passthrough()
        ),
      },
    });
    this.planGenerator = new PlanGenerator();
    this.planExecutor = new PlanExecutor();
  }

  startSession(): SetupSession {
    const manager = new SessionManager();
    const session = manager.getSession();
    this.sessions.set(session.id, manager);

    // Register as resource
    this.updateSessionResource(session);

    return session;
  }

  getNextQuestion(sessionId: string): Question | null {
    const manager = this.sessions.get(sessionId);
    if (!manager) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return manager.getNextQuestion();
  }

  submitAnswer(sessionId: string, answer: unknown): SetupSession {
    const manager = this.sessions.get(sessionId);
    if (!manager) {
      throw new Error(`Session ${sessionId} not found`);
    }

    manager.submitAnswer(answer);
    const session = manager.getSession();
    this.updateSessionResource(session);

    return session;
  }

  generatePlan(sessionId: string): SetupPlan {
    const manager = this.sessions.get(sessionId);
    if (!manager) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const profile = manager.generateProfile();
    // Register profile resource
    this.mcp.registerResource({
      id: sessionId,
      type: 'profile',
      attributes: profile as unknown as Record<string, unknown>,
    });

    const plan = this.planGenerator.generate(profile);
    // Override ID to match session for simplicity in looking it up
    plan.id = sessionId;

    this.plans.set(sessionId, plan);

    this.mcp.registerResource({
      id: sessionId,
      type: 'plan',
      attributes: plan as unknown as Record<string, unknown>,
    });

    return plan;
  }

  async applyPlan(
    sessionId: string,
    workspaceRoot: string
  ): Promise<AppliedChangeset> {
    const plan = this.plans.get(sessionId);
    if (!plan) {
      throw new Error(`Plan for session ${sessionId} not found`);
    }

    const changeset = await this.planExecutor.execute(plan, workspaceRoot);

    this.mcp.registerResource({
      id: changeset.id,
      type: 'changeset',
      attributes: changeset as unknown as Record<string, unknown>,
    });

    return changeset;
  }

  private updateSessionResource(session: SetupSession) {
    this.mcp.registerResource({
      id: session.id,
      type: 'session',
      attributes: session as unknown as Record<string, unknown>,
    });
  }

  // Expose MCP instance if needed
  getMCP(): MCPServer {
    return this.mcp;
  }
}
