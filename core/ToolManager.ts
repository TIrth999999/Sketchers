import type { ToolType } from './types'

class ToolManager {
    active: ToolType = 'SELECT'

    set(tool: string) {
        if (tool == 'SELECT')
            this.active = 'SELECT'
        if (tool == 'LINE')
            this.active = 'LINE'
        if (tool == 'CIRCLE')
            this.active = 'CIRCLE'
        if (tool == 'ELLIPSE')
            this.active = 'ELLIPSE'
        if (tool == 'POLYLINE')
            this.active = 'POLYLINE'
    }
}

export const toolManager = new ToolManager()