// @flow

import type { RenderOptions } from 'pickadate/apis/dom/types'
import { TEMPLATE_HOOK_WORDS } from 'pickadate/defaults'
import { CLASS_NAME_MAP } from 'pickadate/renderers/dom/defaults'

export const RENDER_OPTIONS: RenderOptions = {
  weekdays: TEMPLATE_HOOK_WORDS.DDD,
  renderCell: () => {},
  className: CLASS_NAME_MAP,
}
