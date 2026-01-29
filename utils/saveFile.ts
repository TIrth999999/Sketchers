import type { ShapeStore } from "../core/ShapeStore";

export function saveFile(shapeStore: ShapeStore) {
    const data = shapeStore.getAllShapes().map(shape => {
        return {
            id: shape.id,
            name: shape.name,
            color: shape.color,
            opacity: shape.opacity,
            isHidden: shape.isHidden,
            type: shape.getType(),
            data: shape.getData()
        }
    })
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sketchers.json'
    a.click()
    URL.revokeObjectURL(url)
}