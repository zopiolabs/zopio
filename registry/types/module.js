/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Base module interface for all Zopio modules
 * @typedef {Object} BaseModule
 * @property {string} id - Unique identifier for the module
 * @property {string} name - Display name of the module
 * @property {string} version - Version of the module (semver)
 * @property {string} type - Type of module (app, plugin, integration, tool)
 * @property {string} [author] - Author of the module
 * @property {string} [description] - Description of the module
 * @property {string[]} [tags] - Tags for the module
 * @property {string} entry - Main entry point for the module
 * @property {string} [preview] - Preview image for the module
 * @property {Object.<string, string>} [dependencies] - Dependencies for the module
 * @property {string} [license] - License for the module
 * @property {string} [repository] - Repository URL for the module
 * @property {string} [homepage] - Homepage URL for the module
 * @property {string} [bugs] - Bugs URL for the module
 * @property {string[]} [keywords] - Keywords for the module
 * @property {Object.<string, *>} zopio - Zopio-specific configuration
 */

// Export an empty object as this is just for JSDoc type definitions
module.exports = {};
