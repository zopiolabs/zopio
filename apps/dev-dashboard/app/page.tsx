import { PluginToggle } from "../components/plugin-toggle";
import { FlagEditor } from "../components/flag-editor";
import { UserCreateForm } from "../components/user-create-form";

export default function Home() {
  return (
    <div className="space-y-10">
      <PluginToggle />
      <FlagEditor />
      <UserCreateForm />
    </div>
  );
}