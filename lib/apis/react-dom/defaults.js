// @flow

import type { RenderOptions } from 'pickadate/apis/react-dom/types'
import { CLASS_NAME_MAP } from 'pickadate/renderers/dom/defaults'

export const RENDER_OPTIONS: RenderOptions = {
  mode: 'date',
  renderCell: ({ children }) => children,
  className: CLASS_NAME_MAP,
}
