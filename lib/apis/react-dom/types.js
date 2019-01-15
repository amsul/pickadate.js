// @flow

import type { RenderOptions as DomRenderOptions } from 'pickadate/apis/dom/types'
import * as React from 'react'

export type { ClassName, ClassNameDynamic } from 'pickadate/apis/dom/types'

export type RenderOptions = {
  mode: $ElementType<DomRenderOptions, 'mode'>,
  renderCell: ({ dateObject: Date, children: React.Node }) => React.Node,
  className: $ElementType<DomRenderOptions, 'className'>,
}
