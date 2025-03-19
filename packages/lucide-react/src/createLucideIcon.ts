import { createElement, forwardRef } from 'react';
import { mergeClasses, createLucideClassNames } from '@lucide/shared';
import { IconNode, LucideProps } from './types';
import Icon from './Icon';

/**
 * Create a Lucide icon component
 * @param {string} iconName
 * @param {array} iconNode
 * @returns {ForwardRefExoticComponent} LucideIcon
 */
const createLucideIcon = (iconName: string, iconNode: IconNode, aliasNames: string[] = []) => {
  const lucideClassNames = createLucideClassNames([
    iconName,
    ...aliasNames,
  ]);

  const Component = forwardRef<SVGSVGElement, LucideProps>(({ className, ...props }, ref) =>
    createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(lucideClassNames, className),
      ...props,
    }),
  );

  Component.displayName = `${iconName}`;

  return Component;
};

export default createLucideIcon;
