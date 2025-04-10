# auto-readme

<!-- AUTO-DESCRIPTION -->
Auto-generate README files for your projects using AI. This tool watches your project files for changes and automatically updates your README with relevant information.
<!-- /AUTO-DESCRIPTION -->

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation
<!-- AUTO-INSTALLATION -->
```bash
# Install globally
npm install -g auto-readme

# Or locally in your project
npm install --save-dev auto-readme
```
<!-- /AUTO-INSTALLATION -->

## Usage
<!-- AUTO-USAGE -->
```bash
# Initialize configuration
npm run init

# Generate README once
npm run gen

# Watch for changes
npm start
```

In your project, you can create a custom readme template in `templates/readme-template.md`. The template uses special tag pairs to define sections that can be automatically updated:

```markdown
<!-- AUTO-SECTION_NAME -->
Content will be replaced by AI
<!-- /AUTO-SECTION_NAME -->
```

Sections not defined in `autoSections` in your config will preserve manual edits.

Example configuration (`readme-gen.config.json`):
```json
{
  "watchPaths": ["src/**/*", "package.json"],
  "ignorePatterns": ["**/node_modules/**", "**/dist/**"],
  "model": "mixtral-8x7b-32768",
  "templatePath": "./templates/readme-template.md",
  "autoSections": [
    "description",
    "installation",
    "usage",
    "contributing"
  ],
  "debounce": 2000
}
```
<!-- /AUTO-USAGE -->

## Features
<!-- AUTO-FEATURES -->
- AI-powered README generation using Groq API
- Watch mode for automatic updates
- Custom templates with manual section preservation
- Rate limiting to prevent API overuse
- Support for multiple AI models
- Project context analysis for relevant documentation
<!-- /AUTO-FEATURES -->

## Contributing
<!-- AUTO-CONTRIBUTING -->
Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
<!-- /AUTO-CONTRIBUTING -->

## License
<!-- AUTO-LICENSE -->
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
<!-- /AUTO-LICENSE -->