/* eslint-disable import/no-extraneous-dependencies */
import base64SVG from '@lucide/build-icons/utils/base64SVG.mjs';
import { getJSBanner } from './license.mjs';

export default async ({
  iconName,
  children,
  componentName,
  getSvg,
  deprecated,
  deprecationReason,
  iconNameAliases
}) => {
  const svgContents = await getSvg();
  const svgBase64 = base64SVG(svgContents);

  return `\
<script lang="ts">
${getJSBanner()}
import Icon from '../Icon.svelte';
import type { IconNode, IconProps } from '../types.js';

type $$Props = IconProps;

const iconNode: IconNode = ${JSON.stringify(children)};

/**
 * @component @name ${componentName}
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://lucide.dev/icons/${iconName}
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
</script>

<Icon name="${iconName}" {...$$props} iconNode={iconNode}${
    iconNameAliases != null ? ` aliasNames={${JSON.stringify(iconNameAliases)}}` : ''
}>
  <slot/>
</Icon>
`;
};
