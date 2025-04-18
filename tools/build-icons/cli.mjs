#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import getArgumentOptions from 'minimist';

import { readSvgDirectory } from '@lucide/helpers';
import renderIconsObject from './render/renderIconsObject.mjs';
import generateIconFiles from './building/generateIconFiles.mjs';
import generateExportsFile from './building/generateExportsFile.mjs';

import generateAliasesFiles from './building/aliases/generateAliasesFiles.mjs';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import getIconMetaData from './utils/getIconMetaData.mjs';
import generateDynamicImports from './building/generateDynamicImports.mjs';

const cliArguments = getArgumentOptions(process.argv.slice(2));

const ICONS_DIR = path.resolve(process.cwd(), '../../icons');
const OUTPUT_DIR = path.resolve(process.cwd(), cliArguments.output || '../build');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const {
  renderUniqueKey = false,
  templateSrc,
  silent = false,
  iconFileExtension = '.js',
  importImportFileExtension = '',
  exportFileName = 'index.js',
  exportModuleNameCasing = 'pascal',
  withAliases = false,
  aliasNamesOnly = false,
  withDynamicImports = false,
  separateAliasesFile = false,
  separateAliasesFileExtension = undefined,
  separateIconFileExport = false,
  separateIconFileExportExtension = undefined,
  aliasesFileExtension = '.js',
  aliasImportFileExtension = '',
  pretty = true,
} = cliArguments;

async function buildIcons() {
  if (templateSrc == null) {
    throw new Error('No `templateSrc` argument given.');
  }

  const svgFiles = await readSvgDirectory(ICONS_DIR);

  const icons = await renderIconsObject(svgFiles, ICONS_DIR, renderUniqueKey);

  const { default: iconFileTemplate } = await import(path.resolve(process.cwd(), templateSrc));

  const iconMetaData = await getIconMetaData(ICONS_DIR);

  // Generates iconsNodes files for each icon
  await generateIconFiles({
    iconNodes: icons,
    outputDirectory: OUTPUT_DIR,
    template: iconFileTemplate,
    showLog: !silent,
    iconFileExtension,
    separateIconFileExport,
    separateIconFileExportExtension,
    pretty: JSON.parse(pretty),
    iconsDir: ICONS_DIR,
    iconMetaData,
  });

  if (withAliases) {
    await generateAliasesFiles({
      iconNodes: icons,
      iconMetaData,
      aliasNamesOnly,
      iconFileExtension,
      outputDirectory: OUTPUT_DIR,
      fileExtension: aliasesFileExtension,
      exportModuleNameCasing,
      aliasImportFileExtension,
      separateAliasesFile,
      separateAliasesFileExtension,
      showLog: !silent,
    });
  }

  if (withDynamicImports) {
    await generateDynamicImports({
      iconNodes: icons,
      outputDirectory: OUTPUT_DIR,
      fileExtension: aliasesFileExtension,
      iconMetaData,
      showLog: !silent,
    });
  }

  // Generates entry files for the compiler filled with icons exports
  await generateExportsFile(
    path.join(OUTPUT_DIR, 'icons', exportFileName),
    path.join(OUTPUT_DIR, 'icons'),
    icons,
    exportModuleNameCasing,
    importImportFileExtension,
  );
}

try {
  await buildIcons();
} catch (error) {
  console.error(error);
}
