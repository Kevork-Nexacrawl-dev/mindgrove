#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { analyzeVault } from '../src/analyzer.js';
import { DEFAULT_CONFIG } from '../src/config.js';

program
  .name('mindgrove')
  .description('🌿 Analyze, classify, and auto-link your markdown vault')
  .version('0.1.0');

program
  .command('analyze <vaultPath>')
  .description('Analyze a folder of markdown files — tag frontmatter + build similarity links')
  .option('-t, --threshold <number>', 'similarity threshold (default: 15)', parseInt)
  .option('-m, --max-connections <number>', 'max connections per file (default: 12)', parseInt)
  .option('--no-linking', 'skip Phase 2 bidirectional linking')
  .option('--dry-run', 'analyze only, do not write any files')
  .option('--report <format>', 'report format: text | json | markdown (default: markdown)')
  .action(async (vaultPath, options) => {
    const absPath = path.resolve(vaultPath);

    console.log(chalk.green('\n🌿 mindgrove') + chalk.gray(' — markdown vault analyzer'));
    console.log(chalk.gray(`   Vault: ${absPath}\n`));

    const config = {
      ...DEFAULT_CONFIG,
      similarityThreshold: options.threshold ?? DEFAULT_CONFIG.similarityThreshold,
      maxConnectionsPerFile: options.maxConnections ?? DEFAULT_CONFIG.maxConnectionsPerFile,
      enableLinking: options.linking !== false,
      dryRun: options.dryRun ?? false,
      reportFormat: options.report ?? 'markdown',
    };

    const spinner = ora('Phase 1: Analyzing files...').start();

    try {
      const result = await analyzeVault(absPath, config);
      spinner.succeed(`Phase 1 complete — ${result.processed} files analyzed in ${result.durationSeconds}s`);

      if (config.enableLinking && !config.dryRun) {
        console.log(chalk.cyan(`\n🔗 Phase 2: ${result.connections} bidirectional links written`));
      }

      if (result.errors > 0) {
        console.log(chalk.yellow(`⚠  ${result.errors} files skipped due to errors`));
      }

      console.log(chalk.green('\n✅ Done!\n'));
    } catch (err) {
      spinner.fail('Analysis failed');
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  });

program.parse();
