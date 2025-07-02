/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */
/**
 * React components for the code generator UI
 */
// biome-ignore lint: React is used for JSX and event types
import * as React from 'react';
import { useState } from 'react';
import type { GeneratorOptions } from './generators.js';
import { generateCode } from './generators.js';
import type { TemplateType } from './templates.js';
import { templateTypes } from './templates.js';

export interface CodeGeneratorFormProps {
  /** Default output path */
  defaultOutputPath?: string;
  /** Callback when generation is complete */
  onGenerate?: (files: string[]) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Code Generator Form component
 */
export const CodeGeneratorForm = ({
  defaultOutputPath = './src',
  onGenerate,
  onError,
}: CodeGeneratorFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TemplateType>('component');
  const [outputPath, setOutputPath] = useState(defaultOutputPath);
  const [createTestFile, setCreateTestFile] = useState(true);
  const [createStoryFile, setCreateStoryFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      const options: GeneratorOptions = {
        name,
        description,
        type,
        outputPath,
        createTestFile,
        createStoryFile,
      };

      const files = generateCode(options);
      onGenerate?.(files);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      onError?.(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 font-bold text-xl">Generate Code</h2>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="w-full rounded border p-2"
            placeholder="ComponentName"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="mb-1 block font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="w-full rounded border p-2"
            placeholder="Component description..."
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="mb-1 block font-medium">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setType(e.target.value as TemplateType)
            }
            className="w-full rounded border p-2"
          >
            {templateTypes.map((templateType) => (
              <option key={templateType} value={templateType}>
                {templateType.charAt(0).toUpperCase() + templateType.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="outputPath" className="mb-1 block font-medium">
            Output Path
          </label>
          <input
            id="outputPath"
            type="text"
            value={outputPath}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOutputPath(e.target.value)
            }
            className="w-full rounded border p-2"
            placeholder="./src/components"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="createTestFile"
            checked={createTestFile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCreateTestFile(e.target.checked)
            }
            className="mr-2"
          />
          <label htmlFor="createTestFile">Create test file</label>
        </div>

        {type === 'component' && (
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="createStoryFile"
              checked={createStoryFile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCreateStoryFile(e.target.checked)
              }
              className="mr-2"
            />
            <label htmlFor="createStoryFile">Create Storybook file</label>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isGenerating ? 'Generating...' : 'Generate Code'}
        </button>
      </form>
    </div>
  );
};

/**
 * File list component to display generated files
 */
export const GeneratedFilesList = ({ files }: { files: string[] }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="mb-2 font-medium">Generated Files:</h3>
      <ul className="list-disc pl-5">
        {files.map((file, index) => (
          <li key={index} className="text-gray-700 text-sm">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};
