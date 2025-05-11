export interface PluginDefinition {
  id: string;
  name: string;
  description?: string;
  setup: () => void | Promise<void>;
  teardown?: () => void | Promise<void>;
}